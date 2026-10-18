#!/usr/bin/env node
/**
 * Build 阶段拉取一批真实 CV 三会论文元数据 → public/papers.json
 *
 * 数据源：OpenAlex（https://api.openalex.org）
 *   - 覆盖广、有 abstract、免费、CORS 友好、机器请求不限速
 *   - 用 polite pool（带 User-Agent + mailto）可以拿到更高 rate
 *
 * 输入：内置的"代表性论文标题"种子列表（覆盖 CVPR/ICCV/ECCV 2018-2024）
 * 流程：每个标题 → OpenAlex search → 解析 venue/year/authors/abstract/doi
 *   - 命中且 venue 是 CVPR/ICCV/ECCV 才采纳
 *   - 抽象：abstract_inverted_index → 还原成字符串
 * 输出：public/papers.json（Vite 直接打包进 dist/）
 *
 * 网络失败/无命中时：不会让 build 失败，写空数组。
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT  = path.join(ROOT, 'public', 'papers.json')

// 论文标题种子：覆盖 CVPR/ICCV/ECCV 2018-2024 的代表性论文。
// 选的是真实标题，OpenAlex 一般都能命中。
const TITLE_SEEDS = [
  // CVPR 2024
  'Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data',
  '3D Gaussian Splatting for Real-Time Radiance Field Rendering',
  'DINOv2: Learning Robust Visual Features without Supervision',
  'Instant Neural Graphics Primitives with a Multiresolution Hash Encoding',
  'Tracking Anything with Decoupled Video Segmentation',
  // CVPR 2023
  'Learning Transferable Visual Models From Natural Language Supervision',
  'BLIP: Bootstrapping Language-Image Pre-training',
  'Grounded Language-Image Pre-training',
  'Denoising Diffusion Probabilistic Models',
  'Mask R-CNN',
  'Segment Anything',
  // ICCV 2023
  'Track Anything Model',
  'Magic3D: High-Resolution Text-to-3D Content Creation',
  'Open-vocabulary object detection via vision and language knowledge distillation',
  'Adding Conditional Control to Text-to-Image Diffusion Models',
  'Segmenter: Transformer for Semantic Segmentation',
  'Human Motion Diffusion as a Generative Prior',
  // ECCV 2022 / CVPR 2022 等
  'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
  'End-to-End Object Detection with Transformers',
  'NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis',
  'Swin Transformer: Hierarchical Vision Transformer using Shifted Windows',
  'Masked Autoencoders Are Scalable Vision Learners',
  'Mask2Former: Masked-attention Mask Transformer for Universal Image Segmentation',
  'Restormer: Efficient Transformer for High-Resolution Image Restoration',
  // CVPR 2022
  'GLIPv2: Unifying Localization and Vision-Language Understanding',
  'BEiT: BERT Pre-Training of Image Transformers',
  'MAE: Masked Autoencoders Are Scalable Vision Learners',
  'Pix2Seq: A Language Modeling Framework for Object Detection',
  'High-Resolution Image Synthesis with Latent Diffusion Models',
  // ICCV 2021
  'Swin Transformer: Hierarchical Vision Transformer using Shifted Windows',
  'Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields',
  'MOCO: Momentum Contrast for Unsupervised Visual Representation Learning',
  'SimSiam: Exploring Simple Siamese Representation Learning',
  'PointNet++: Deep Hierarchical Feature Learning on Point Sets in a Metric Space',
  // CVPR 2021
  'Momentum Contrast for Unsupervised Visual Representation Learning',
  'Exploring Simple Siamese Representation Learning',
  'LoFTR: Detector-Free Local Feature Matching with Transformers',
  'Barlow Twins: Self-Supervised Learning via Redundancy Reduction',
  'T2T-ViT: Tokens-to-Token ViT Training in Image Superresolution',
  // ECCV 2020
  'DETR: End-to-End Object Detection with Transformers',
  'Denoising Diffusion Probabilistic Models',
  // CVPR 2020
  'Unsupervised Translation of Programming Languages',
  'Image-to-Image Translation with Conditional Adversarial Networks',
  // ICCV 2019
  'A Simple Framework for Contrastive Learning of Visual Representations',
  'MOCO v2: Improved Baselines with Momentum Contrastive Learning',
  // CVPR 2019
  'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
  // ECCV 2018
  'You Only Look Once: Unified, Real-Time Object Detection',
  'U-Net: Convolutional Networks for Biomedical Image Segmentation',
  // 历史奠基类
  'ResNet: Deep Residual Learning for Image Recognition',
  'VGG: Very Deep Convolutional Networks for Large-Scale Image Recognition',
  'ImageNet Classification with Deep Convolutional Neural Networks',
  'Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks',
  'Generative Adversarial Networks',
  'You Only Look Once v2',
  'EfficientDet: Scalable and Efficient Object Detection',
  'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
  'CycleGAN: Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks',
  'StyleGAN: A Style-Based Generator Architecture for Generative Adversarial Networks',
  'PointNet: Deep Learning on Point Sets for 3D Classification and Segmentation',
  'Pix2Pix: Image-to-Image Translation with Conditional Adversarial Networks',
  'BigGAN: Large Scale GAN Training for High Fidelity Natural Image Synthesis',
  'ESRGAN: Enhanced Super-Resolution Generative Adversarial Networks',
  'Stable Diffusion: High-Resolution Image Synthesis with Latent Diffusion Models',
  'LLaMA: Open and Efficient Foundation Language Models',
  'Visual Instruction Tuning',
  'BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models',
  'DreamBooth: Fine-Tuning Text-to-Image Diffusion Models for Subject-Driven Generation',
  'InstructPix2Pix: Learning to Follow Image Editing Instructions',
  'SAM 2: Segment Anything in Images and Videos',
  'LLaVA: Visual Instruction Tuning',
  'Grounding DINO: Marrying DINO with Grounded Pre-Training for Open-Set Object Detection',
  'InstructBLIP: Towards General-purpose Vision-Language Models with Instruction Tuning',
  'DALL-E: Zero-Shot Text-to-Image Generation',
  'CLIP',
  'ViT-GAN',
  'Pixel2Mesh: Generating 3D Mesh Models from Single RGB Images',
  'Pixel2Mesh++: Multi-View 3D Mesh Generation via Deformation',
  'PanoHDR: A Panoramic High Dynamic Range Image Dataset',
  'Deep Image Prior',
  'Vision Transformer with Differentiable Resolution',
  'ConvNeXt: A ConvNet for the 2020s',
  'PoolFormer: MetaFormer Is Actually What You Need for Vision',
  'ConvNeXt V2: Co-designing and Scaling ConvNets with Masked Autoencoders',
  'A ConvNet for the 2020s',
  'MobileNetV2: Inverted Residuals and Linear Bottlenecks',
  'EfficientNetV2: Smaller Models and Faster Training',
  'MnasNet: Platform-Aware Neural Architecture Search for Mobile',
  'Once for All: Train One Network and Specialize it for Efficient Deployment',
  'GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding',
  'Object Detection in 20 Years: A Survey',
  'A Survey on Transfer Learning',
  'A Survey on Deep Learning in Medical Image Analysis',
  'A Survey of Deep Learning Techniques for Neural Machine Translation',
  'Learning Deep Features for Scene Recognition using Places Database',
  'Places: A 10-million Image Database for Scene Recognition',
  'Glove: Global Vectors for Word Representation',
  'Word2Vec: Efficient Estimation of Word Representations in Vector Space',
  'ImageNet Large Scale Visual Recognition Challenge',
  'Microsoft COCO: Common Objects in Context',
  'The PASCAL Visual Object Classes Challenge',
]

// OpenAlex 的 venue name → 我们用的 venue key
const VENUE_MAP = [
  { keys: ['cvpr', 'computer vision and pattern recognition'], v: 'CVPR' },
  { keys: ['iccv', 'international conference on computer vision'], v: 'ICCV' },
  { keys: ['eccv', 'european conference on computer vision'], v: 'ECCV' },
]

function mapVenue(rawName) {
  if (!rawName) return null
  const lower = rawName.toLowerCase()
  for (const { keys, v } of VENUE_MAP) {
    if (keys.some((k) => lower.includes(k))) return v
  }
  return null
}

// OpenAlex 的 abstract 是 inverted index，需要还原成原文
function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return ''
  const positions = []
  for (const [word, idxs] of Object.entries(invertedIndex)) {
    for (const p of idxs) positions.push([p, word])
  }
  positions.sort((a, b) => a[0] - b[0])
  return positions.map(([, w]) => w).join(' ').trim()
}

// 从 title + abstract 抽关键词（与原 server/keywords.js 同思路）
const STOP_WORDS = new Set(
  `a,about,above,after,again,against,all,am,an,and,any,are,aren,as,at,be,because,been,before,being,between,both,but,by,could,couldn,did,didn,do,does,doesn,doing,don,down,during,each,few,for,further,had,hadn,has,hasn,have,haven,having,he,her,here,hers,herself,him,himself,his,how,i,if,in,into,is,isn,it,its,itself,just,ll,let,me,more,most,mustn,my,myself,no,nor,not,now,of,off,on,once,only,or,other,our,ours,ourselves,out,over,own,re,s,shan,she,should,shouldn,so,some,such,t,than,that,the,their,theirs,them,themselves,then,there,these,they,this,those,through,to,too,under,until,up,ve,very,was,wasn,were,weren,what,when,where,which,while,who,whom,why,will,with,won,would,wouldn,you,your,yours,yourself,yourselves,also,use,used,using,via,well,may,many,often,new,based,approach,paper,propose,proposed,method,methods,results,show,shown,achieves,achieving,evaluate,evaluation,compared,comparison,existing,recent,state,art,model,models,framework,technique,techniques,problem,task,datasets,set,train,test,image,images,video,feature,features,work,works,large,scale,sota`
    .split(',').map((s) => s.trim())
)
const DOMAIN_STOP = new Set([
  'image','images','video','feature','features','method','methods','approach','approaches',
  'result','results','task','tasks','model','models','framework','frameworks','paper',
  'work','works','propose','proposed','show','shown','achieve','achieves',
  'state-of-the-art','sota','performance','novel','effective','efficient','accurate'
])
const TOKEN_RE = /[a-z][a-z0-9-]{1,}|\d+|[一-鿿]{2,3}/g
function tokenize(text) {
  if (!text) return []
  const lower = text.toLowerCase()
  return (lower.match(TOKEN_RE) || []).filter((w) => {
    if (w.length < 2) return false
    if (STOP_WORDS.has(w)) return false
    if (DOMAIN_STOP.has(w)) return false
    if (/^\d+$/.test(w)) return false
    return true
  })
}
function extractKeywords(text, topN = 8) {
  const tokens = tokenize(text)
  const freq = new Map()
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1)
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN).map(([k]) => k)
}

function cleanDoi(doi) {
  if (!doi) return ''
  return doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim()
}

async function fetchOne(title, mailto, signal) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(title)}&per-page=1&mailto=${encodeURIComponent(mailto)}`
  const res = await fetch(url, {
    signal,
    headers: { 'User-Agent': `cv-paper-platform/1.0 (mailto:${mailto})` },
  })
  if (!res.ok) return null
  const data = await res.json()
  const hit = data?.results?.[0]
  if (!hit) return null

  const venue = mapVenue(hit?.primary_location?.source?.display_name)
  if (!venue) return null // 只收 CV 三会

  const year = hit.publication_year
  if (!year || year < 2010) return null

  const authors = (hit.authorships || [])
    .map((a) => a?.author?.display_name)
    .filter(Boolean)

  const abstract = reconstructAbstract(hit.abstract_inverted_index)
  const doi = cleanDoi(hit.doi)
  const url2 = doi ? `https://doi.org/${doi}` : (hit.primary_location?.source?.homepage_url || 'https://openalex.org/' + hit.id)

  // id 用 venue+year+doi slug（与 seed.js 里的风格保持一致）
  const slug = (doi || hit.id || title).replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60)
  const id = `${venue.toLowerCase()}${year}-${slug}`

  return {
    id,
    title: hit.title || title,
    doi,
    venue,
    year,
    authors,
    abstract,
    keywords: extractKeywords(`${title}. ${abstract}`, 6),
    url: url2,
  }
}

async function main() {
  const mailto = process.env.OPENALEX_MAILTO || 'cv-paper-platform@example.com'
  const ctrl = new AbortController()
  const results = []
  const seen = new Set() // 按 title 去重
  const CONCURRENCY = 5
  const queue = [...TITLE_SEEDS]
  let ok = 0
  let fail = 0

  async function worker() {
    while (queue.length) {
      const t = queue.shift()
      try {
        const r = await fetchOne(t, mailto, ctrl.signal)
        if (r) {
          if (!seen.has(r.title.toLowerCase())) {
            seen.add(r.title.toLowerCase())
            results.push(r)
            ok++
          } else {
            ok++ // 重复命中也算成功
          }
        } else {
          fail++
          console.warn(`  [miss] ${t.slice(0, 60)}`)
        }
      } catch (e) {
        fail++
        console.warn(`  [err]  ${t.slice(0, 60)} :: ${e.message}`)
      }
    }
  }

  console.log(`[build-static] 从 OpenAlex 抓取 ${TITLE_SEEDS.length} 个标题的元数据…`)
  const startTime = Date.now()
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  // 排序：年份降序 + 标题
  results.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))

  mkdirSync(path.dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`[build-static] 命中 ${ok} / 失败 ${fail} / 去重后 ${results.length} 篇 → ${path.relative(ROOT, OUT)}`)
  console.log(`[build-static] 用时 ${elapsed}s`)
}

main().catch((e) => {
  console.error('[build-static] 致命错误:', e)
  // 不让 build 失败：写空数组
  try {
    mkdirSync(path.dirname(OUT), { recursive: true })
    writeFileSync(OUT, '[]', 'utf-8')
  } catch {}
  process.exit(0)
})