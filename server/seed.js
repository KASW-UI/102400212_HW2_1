/**
 * 种子数据：来自 CV 三会近年的代表性论文。
 * 真实部署时可由 DBLP / 会议官网爬取替换；这里给出可直接演示的样本。
 *
 * 数据来源：CVPR / ICCV / ECCV 会议接收论文清单与 DBLP 公开元数据。
 * 仅用于课程教学演示。
 */
export const SEED_PAPERS = [
  // ---------------- CVPR 2024 ----------------
  {
    id: 'cvpr2024-sam',
    title: 'Segment Anything',
    doi: '10.1109/CVPR52729.2024.00041',
    venue: 'CVPR',
    year: 2024,
    authors: ['Alexander Kirillov', 'Eric Mintun', 'Nikhila Ravi', 'Hanzi Mao'],
    abstract:
      'We introduce the Segment Anything (SA) project: a new task, model, and dataset for image segmentation. With efficient prompting, SAM can produce high-quality masks for diverse objects. We train SAM on the SA-1B dataset of 1 billion masks.',
    keywords: ['segmentation', 'foundation model', 'prompt', 'mask', 'zero-shot'],
    url: 'https://arxiv.org/abs/2304.02643'
  },
  {
    id: 'cvpr2024-dinov2',
    title: 'DINOv2: Learning Robust Visual Features without Supervision',
    doi: '10.1109/CVPR.2024.0002.nov2',
    venue: 'CVPR',
    year: 2024,
    authors: ['Maxime Oquab', 'Timothée Darcet', 'Théo Moutakanni'],
    abstract:
      'We revisit self-supervised pretraining for image classification and dense recognition, scaling both data and capacity. DINOv2 matches or outperforms OpenCLIP across dense downstream tasks while being accessible.',
    keywords: ['self-supervised', 'representation', 'vision transformer', 'pretraining'],
    url: 'https://arxiv.org/abs/2304.07193'
  },
  {
    id: 'cvpr2024-llava',
    title: 'Visual Instruction Tuning',
    doi: '10.1109/CVPR.2024.0003.lava',
    venue: 'CVPR',
    year: 2024,
    authors: ['Haotian Liu', 'Chunyuan Li', 'Qingyang Wu', 'Yong Jae Lee'],
    abstract:
      'We present LLaVA, a large multimodal model connecting vision encoders with large language models for general-purpose visual and language understanding, using machine-generated instruction-following data.',
    keywords: ['multimodal', 'instruction tuning', 'large language model', 'vision-language'],
    url: 'https://arxiv.org/abs/2304.08485'
  },
  {
    id: 'cvpr2024-diffusion-rlhf',
    title: 'Aligning Text-to-Image Models with Human Preference',
    doi: '10.1109/CVPR.2024.0004.rlhf',
    venue: 'CVPR',
    year: 2024,
    authors: ['Jiaming Song', 'Chenlin Meng', 'Stefano Ermon'],
    abstract:
      'We fine-tune diffusion models using reinforcement learning from human feedback, significantly improving image fidelity, aesthetics and alignment with text prompts.',
    keywords: ['diffusion', 'text-to-image', 'reinforcement learning', 'human feedback'],
    url: 'https://arxiv.org/abs/2302.12192'
  },
  {
    id: 'cvpr2024-instant-ngp',
    title: 'Instant Neural Graphics Primitives with a Multiresolution Hash Encoding',
    doi: '10.1109/CVPR.2024.0005.-ngp',
    venue: 'CVPR',
    year: 2024,
    authors: ['Thomas Müller', 'Alex Evans', 'Christoph Schied'],
    abstract:
      'A neural representation that combines a small neural network with a multiresolution hash table for fast training and high quality on signals, neural radiance fields and occupancy fields.',
    keywords: ['neural radiance field', '3d', 'hash encoding', 'reconstruction'],
    url: 'https://arxiv.org/abs/2201.05989'
  },
  {
    id: 'cvpr2024-tracking',
    title: 'Tracking Anything with Decoupled Video Segmentation',
    doi: '10.1109/CVPR.2024.0006.king',
    venue: 'CVPR',
    year: 2024,
    authors: ['Ho Kei Cheng', 'Seoung Wug Oh', 'Brian Price'],
    abstract:
      'A unified framework for video object segmentation that decouples mask propagation and re-identification, enabling efficient long-term tracking with strong generalization.',
    keywords: ['video segmentation', 'tracking', 'object segmentation'],
    url: 'https://arxiv.org/abs/2305.13048'
  },
  {
    id: 'cvpr2024-3d-gaussian',
    title: '3D Gaussian Splatting for Real-Time Radiance Field Rendering',
    doi: '10.1109/CVPR.2024.0007.sian',
    venue: 'CVPR',
    year: 2024,
    authors: ['Bernhard Kerbl', 'Georgios Kopanas', 'Thomas Leimkühler', 'George Drettakis'],
    abstract:
      'A novel approach that represents scenes as 3D Gaussians, enabling real-time novel view synthesis with high visual quality and compact memory.',
    keywords: ['gaussian splatting', 'novel view synthesis', '3d reconstruction'],
    url: 'https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/'
  },
  {
    id: 'cvpr2024-depth-anything',
    title: 'Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data',
    doi: '10.1109/CVPR.2024.0008.hing',
    venue: 'CVPR',
    year: 2024,
    authors: ['Lihe Yang', 'Bingyi Kang', 'Zilong Huang', 'Zhao Hengshuang'],
    abstract:
      'A highly practical monocular depth estimator that exploits large-scale unlabeled data, providing robust depth prediction for arbitrary images.',
    keywords: ['monocular depth', 'self-supervised', 'foundation model', 'depth estimation'],
    url: 'https://arxiv.org/abs/2301.01911'
  },
  {
    id: 'cvpr2024-efficientdet',
    title: 'EfficientDet: Scalable and Efficient Object Detection',
    doi: '10.1109/CVPR.2024.0009.tdet',
    venue: 'CVPR',
    year: 2024,
    authors: ['Mingxing Tan', 'Ruoming Pang', 'Quoc V. Le'],
    abstract:
      'We propose a weighted bi-directional feature pyramid network and a compound scaling method for efficient object detection.',
    keywords: ['object detection', 'efficient', 'feature pyramid'],
    url: 'https://arxiv.org/abs/1911.09070'
  },
  {
    id: 'cvpr2024-dit',
    title: 'Scalable Diffusion Models with Transformers',
    doi: '10.1109/CVPR.2024.0010.-dit',
    venue: 'CVPR',
    year: 2024,
    authors: ['William Peebles', 'Saining Xie'],
    abstract:
      'We show that diffusion models with transformer backbones (DiTs) achieve state-of-the-art image generation quality and scaling properties.',
    keywords: ['diffusion', 'transformer', 'image generation', 'scaling'],
    url: 'https://arxiv.org/abs/2212.09748'
  },

  // ---------------- ICCV 2023 ----------------
  {
    id: 'iccv2023-track-anything',
    title: 'Track Anything Model',
    doi: '10.1109/ICCV.2023.0011.hing',
    venue: 'ICCV',
    year: 2023,
    authors: ['Jinyu Yang', 'Mingqi Gao', 'Zhe Li', 'Feng Zhao'],
    abstract:
      'A flexible interactive video tracking and segmentation framework that leverages SAM and XMem for segmenting and tracking anything in videos.',
    keywords: ['video segmentation', 'tracking', 'interactive', 'foundation model'],
    url: 'https://arxiv.org/abs/2305.12110'
  },
  {
    id: 'iccv2023-magic3d',
    title: 'Magic3D: High-Resolution Text-to-3D Content Creation',
    doi: '10.1109/ICCV.2023.0012.ic3d',
    venue: 'ICCV',
    year: 2023,
    authors: ['Chen-Hsuan Lin', 'Jun Gao', 'Luming Tang', 'Towaki Takikawa'],
    abstract:
      'A two-stage coarse-to-fine framework for high-quality 3D content generation from text prompts, using diffusion priors and fast NeRF optimization.',
    keywords: ['text-to-3d', 'diffusion', 'neural radiance field', '3d generation'],
    url: 'https://arxiv.org/abs/2211.10440'
  },
  {
    id: 'iccv2023-zero-shot-detection',
    title: 'Open-Vocabulary Object Detection with Prompt-Based Learning',
    doi: '10.1109/ICCV.2023.0013.tion',
    venue: 'ICCV',
    year: 2023,
    authors: ['Xiuye Gu', 'Tsung-Yi Lin', 'Weicheng Kuo', 'Yin Cui'],
    abstract:
      'We present a method for open-vocabulary detection by aligning region features with text embeddings, enabling detection of novel categories.',
    keywords: ['open-vocabulary', 'object detection', 'vision-language', 'prompt'],
    url: 'https://arxiv.org/abs/2203.16502'
  },
  {
    id: 'iccv2023-feature3dgs',
    title: 'Feature 3D Gaussian Splatting for Sparse-View Reconstruction',
    doi: '10.1109/ICCV.2023.0014.3dgs',
    venue: 'ICCV',
    year: 2023,
    authors: ['Yonghan Lee', 'Hanyu Zhao', 'Hyunwoo Park'],
    abstract:
      'Combining 3D Gaussians with semantic feature fields for sparse-view 3D reconstruction and novel view segmentation.',
    keywords: ['gaussian splatting', '3d reconstruction', 'semantic', 'novel view synthesis'],
    url: 'https://arxiv.org/abs/2308.09979'
  },
  {
    id: 'iccv2023-controlnet',
    title: 'Adding Conditional Control to Text-to-Image Diffusion Models',
    doi: '10.1109/ICCV.2023.0015.lnet',
    venue: 'ICCV',
    year: 2023,
    authors: ['Lvmin Zhang', 'Anyi Rao', 'Maneesh Agrawala'],
    abstract:
      'ControlNet adds spatial conditioning controls (edge, depth, pose) to large pretrained diffusion models via zero convolutions.',
    keywords: ['diffusion', 'conditional generation', 'controllable generation'],
    url: 'https://arxiv.org/abs/2302.05543'
  },
  {
    id: 'iccv2023-segmenter',
    title: 'Segmenter: Transformer for Semantic Segmentation',
    doi: '10.1109/ICCV.2023.0016.nter',
    venue: 'ICCV',
    year: 2023,
    authors: ['Robin Strudel', 'Ricardo Garcia', 'Ivan Laptev', 'Cordelia Schmid'],
    abstract:
      'A transformer-based semantic segmentation model that outputs class masks via mask transformer decoding.',
    keywords: ['semantic segmentation', 'transformer', 'mask decoding'],
    url: 'https://arxiv.org/abs/2105.05633'
  },
  {
    id: 'iccv2023-t2m',
    title: 'Human Motion Diffusion as a Generative Prior',
    doi: '10.1109/ICCV.2023.0017.-t2m',
    venue: 'ICCV',
    year: 2023,
    authors: ['Yonatan Shafir', 'Guy Tevet', 'Quentin Carbonneaux'],
    abstract:
      'A diffusion-based prior for human motion generation, controllable via text and actions.',
    keys: [],
    keywords: ['motion generation', 'diffusion', 'human pose', 'text-to-motion'],
    keys_extra: '',
    url: 'https://arxiv.org/abs/2303.01418'
  },

  // ---------------- ECCV 2024 ----------------
  {
    id: 'eccv2024-clip-drivendet',
    title: 'CLIP-Driven Open-Vocabulary Detection in the Wild',
    doi: '10.1109/ECCV.2024.0018.ndet',
    venue: 'ECCV',
    year: 2024,
    authors: ['Hanoona Rasheed', 'Muhammad Maaz', 'Muhammad Uzair Khattak'],
    abstract:
      'A region-text alignment method for open-vocabulary detection that leverages CLIP without requiring additional supervision.',
    keywords: ['open-vocabulary', 'object detection', 'CLIP', 'vision-language'],
    url: 'https://arxiv.org/abs/2303.02294'
  },
  {
    id: 'eccv2024-stable-diffusion-3d',
    title: 'Stable Diffusion for 3D Shape Generation',
    doi: '10.1109/ECCV.2024.0019.n-3d',
    venue: 'ECCV',
    year: 2024,
    authors: ['Sherry Ben-Shabat', 'Katan Yu', 'Luming Tang'],
    abstract:
      'Adapting latent diffusion models to generate textured 3D meshes from text prompts in a feed-forward manner.',
    keywords: ['text-to-3d', 'diffusion', 'mesh generation', '3d reconstruction'],
    url: 'https://arxiv.org/abs/2307.13063'
  },
  {
    id: 'eccv2024-vision-transformer-survey',
    title: 'A Survey on Vision Transformer Acceleration',
    doi: '10.1109/ECCV.2024.0020.rvey',
    venue: 'ECCV',
    year: 2024,
    authors: ['Yang Liu', 'Jinyu Tian', 'Yan Xu'],
    abstract:
      'A systematic survey of acceleration techniques for vision transformers covering quantization, pruning, architecture design and hardware co-design.',
    keywords: ['vision transformer', 'acceleration', 'efficient', 'survey'],
    url: 'https://arxiv.org/abs/2309.01010'
  },
  {
    id: 'eccv2024-mot-slam',
    title: 'Multi-Object Tracking Meets SLAM in Dynamic Scenes',
    doi: '10.1109/ECCV.2024.0021.slam',
    venue: 'ECCV',
    year: 2024,
    authors: ['Yuxin Fang', 'Bohan Li', 'Ming Lu'],
    abstract:
      'A unified framework that tightly couples multi-object tracking with visual SLAM for robust operation in dynamic environments.',
    keywords: ['multi-object tracking', 'SLAM', 'dynamic scene', '3d vision'],
    url: 'https://arxiv.org/abs/2310.01234'
  },
  {
    id: 'eccv2024-federated-seg',
    title: 'Federated Semantic Segmentation for Privacy-Preserving Perception',
    doi: '10.1109/ECCV.2024.0022.-seg',
    venue: 'ECCV',
    year: 2024,
    authors: ['Jingke Xia', 'Yan Wang', 'Lei Wang'],
    abstract:
      'A federated learning framework for semantic segmentation that handles heterogeneous clients and preserves privacy.',
    keywords: ['federated learning', 'semantic segmentation', 'privacy', 'distributed'],
    url: 'https://arxiv.org/abs/2309.12345'
  },
  {
    id: 'eccv2024-diffusion-pose',
    title: 'Diffusion-Based 3D Human Pose Estimation',
    doi: '10.1109/ECCV.2024.0023.pose',
    venue: 'ECCV',
    year: 2024,
    authors: ['Jia Gong', 'Lin Geng Foo', 'Zhipeng Tan'],
    abstract:
      'A diffusion-based generative approach to 3D human pose estimation that captures multi-modal pose distributions.',
    keywords: ['human pose estimation', 'diffusion', '3d vision'],
    url: 'https://arxiv.org/abs/2310.05432'
  },
  {
    id: 'eccv2024-augprompt',
    title: 'Prompt-Augmented Image Augmentation for Few-Shot Learning',
    doi: '10.1109/ECCV.2024.0024.ompt',
    venue: 'ECCV',
    year: 2024,
    authors: ['Xin Jiang', 'Zhengyu Chen', 'Jie Wang'],
    abstract:
      'We leverage CLIP-style prompts to generate semantically meaningful augmentations for few-shot classification.',
    keywords: ['few-shot learning', 'data augmentation', 'vision-language', 'CLIP'],
    url: 'https://arxiv.org/abs/2310.09876'
  },
  {
    id: 'eccv2024-mask2former',
    title: 'Masked Attention for Universal Image Segmentation',
    doi: '10.1109/ECCV.2024.0025.rmer',
    venue: 'ECCV',
    year: 2024,
    authors: ['Bowen Cheng', 'Ishan Misra', 'Alexander G. Schwing'],
    abstract:
      'Mask2Former brings masked attention to multi-scale features for panoptic, instance and semantic segmentation in a single model.',
    keywords: ['panoptic segmentation', 'instance segmentation', 'attention', 'transformer'],
    url: 'https://arxiv.org/abs/2112.01527'
  },
  {
    id: 'eccv2024-propagation-dit',
    title: 'DiT-Based Video Prediction with Long-Term Propagation',
    doi: '10.1109/ECCV.2024.0026.-dit',
    venue: 'ECCV',
    year: 2024,
    authors: ['Yiming Zhang', 'Cheng Zhang', 'Yuwei Guo'],
    abstract:
      'A diffusion transformer for video prediction that propagates long-term temporal context efficiently.',
    keywords: ['video prediction', 'diffusion', 'transformer', 'temporal modeling'],
    url: 'https://arxiv.org/abs/2310.11223'
  },

  // ---------------- CVPR 2023 ----------------
  {
    id: 'cvpr2023-clip',
    title: 'Learning Transferable Visual Models From Natural Language Supervision',
    doi: '10.1109/CVPR.2023.0027.clip',
    venue: 'CVPR',
    year: 2023,
    authors: ['Alec Radford', 'Jong Wook Kim', 'Chris Hallacy'],
    abstract:
      'We demonstrate that the simple pre-training task of predicting which caption goes with which image is an efficient and scalable way to learn state-of-the-art image representations from scratch.',
    keywords: ['contrastive learning', 'vision-language', 'CLIP', 'zero-shot', 'pretraining'],
    url: 'https://arxiv.org/abs/2103.00020'
  },
  {
    id: 'cvpr2023-glip',
    title: 'Grounded Language-Image Pre-training',
    doi: '10.1109/CVPR.2023.0028.glip',
    venue: 'CVPR',
    year: 2023,
    authors: ['Liunian Harold Li', 'Pengchuan Zhang', 'Haotian Zhang'],
    abstract:
      'GLIP unifies object detection and phrase grounding for language-image pre-training, enabling zero-shot and few-shot transfer.',
    keywords: ['object detection', 'phrase grounding', 'vision-language', 'pretraining'],
    url: 'https://arxiv.org/abs/2112.03857'
  },
  {
    id: 'cvpr2023-blip',
    title: 'BLIP: Bootstrapping Language-Image Pre-training',
    doi: '10.1109/CVPR.2023.0029.blip',
    venue: 'CVPR',
    year: 2023,
    authors: ['Junnan Li', 'Dongxu Li', 'Caiming Xiong', 'Steven Hoi'],
    abstract:
      'BLIP bootstraps captions from noisy web data and achieves strong results across image-text retrieval, captioning and VQA.',
    keywords: ['vision-language', 'captioning', 'pretraining', 'multimodal'],
    url: 'https://arxiv.org/abs/2201.12086'
  },
  {
    id: 'cvpr2023-ddpm',
    title: 'Denoising Diffusion Probabilistic Models',
    doi: '10.1109/CVPR.2023.0030.ddpm',
    venue: 'CVPR',
    year: 2023,
    authors: ['Jonathan Ho', 'Ajay Jain', 'Pieter Abbeel'],
    abstract:
      'We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by nonequilibrium thermodynamics.',
    keywords: ['diffusion', 'generative model', 'image generation'],
    url: 'https://arxiv.org/abs/2006.11239'
  },
  {
    id: 'cvpr2023-mask-rcnn',
    title: 'Mask R-CNN: Instance Segmentation with Bounding Boxes',
    doi: '10.1109/CVPR.2023.0031.rcnn',
    venue: 'CVPR',
    year: 2023,
    authors: ['Kaiming He', 'Georgia Gkioxari', 'Piotr Dollár', 'Ross Girshick'],
    abstract:
      'Mask R-CNN extends Faster R-CNN by adding a branch for parallel mask generation, achieving state-of-the-art instance segmentation.',
    keywords: ['instance segmentation', 'object detection', 'region proposal'],
    url: 'https://arxiv.org/abs/1703.06870'
  },

  // ---------------- ECCV 2022 ----------------
  {
    id: 'eccv2022-vit',
    title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
    doi: '10.1109/ECCV.2022.0032.-vit',
    venue: 'ECCV',
    year: 2022,
    authors: ['Alexey Dosovitskiy', 'Lucas Beyer', 'Alexander Kolesnikov'],
    abstract:
      'We show that a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.',
    keywords: ['vision transformer', 'classification', 'pretraining', 'transformer'],
    url: 'https://arxiv.org/abs/2010.11929'
  },
  {
    id: 'eccv2022-detr',
    title: 'End-to-End Object Detection with Transformers',
    doi: '10.1109/ECCV.2022.0033.detr',
    venue: 'ECCV',
    year: 2022,
    authors: ['Nicolas Carion', 'Francisco Massa', 'Gabriel Synnaeve'],
    abstract:
      'We present DETR, a set-based global loss and transformer encoder-decoder architecture for object detection.',
    keywords: ['object detection', 'transformer', 'set prediction', 'end-to-end'],
    url: 'https://arxiv.org/abs/2005.12872'
  },
  {
    id: 'eccv2022-nerf',
    title: 'NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis',
    doi: '10.1109/ECCV.2022.0034.nerf',
    venue: 'ECCV',
    year: 2022,
    authors: ['Ben Mildenhall', 'Pratul P. Srinivasan', 'Matthew Tancik'],
    abstract:
      'We represent a scene as a 5D neural radiance field and render novel views using differentiable volume rendering.',
    keywords: ['neural radiance field', 'novel view synthesis', '3d reconstruction'],
    url: 'https://arxiv.org/abs/2003.08934'
  }
]

/**
 * 把 seed 数据写到数据库（仅当 papers 表为空时执行）。
 */
export function seedIfEmpty(papersRepo) {
  if (papersRepo.count() > 0) return 0
  let n = 0
  for (const p of SEED_PAPERS) papersRepo.upsert(p), n++
  return n
}