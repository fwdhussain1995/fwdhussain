import { Author, Paper, PaperStatus } from './types';

export const CURRENT_USER: Author = {
  id: 'u1',
  name: 'Dr. Elena Rostova',
  avatar: 'https://picsum.photos/seed/elena/100/100',
  affiliation: 'Institute of Advanced Cybernetics',
};

export const MOCK_PAPERS: Paper[] = [
  {
    id: 'p1',
    title: 'Generative Agents: Interactive Simulacra of Human Behavior',
    abstract: 'We demonstrate generative agents—computational software agents that simulate believable human behavior. Generative agents wake up, cook breakfast, and head to work; artists paint, while authors write; they form opinions, notice each other, and initiate conversations.',
    content: `# Generative Agents: Interactive Simulacra of Human Behavior

## 1. Introduction
We demonstrate generative agents—computational software agents that simulate believable human behavior. Generative agents wake up, cook breakfast, and head to work; artists paint, while authors write; they form opinions, notice each other, and initiate conversations.

## 2. Architecture
Our architecture extends a large language model to store a complete record of the agent's experiences using natural language, synthesize those memories over time into higher-level reflections, and retrieve them dynamically to plan behavior.

## 3. Evaluation
We instantiate generative agents to populate an interactive sandbox environment inspired by The Sims, where end users can interact with a small town of twenty-five agents using natural language.
    `,
    authors: [CURRENT_USER, { id: 'u2', name: 'Joon Park', avatar: 'https://picsum.photos/seed/joon/100/100', affiliation: 'Stanford University' }],
    status: PaperStatus.PUBLISHED,
    publishDate: '2023-04-10',
    tags: ['AI', 'LLM', 'Simulation'],
    citations: 1245,
    coverImage: 'https://picsum.photos/seed/agent/800/400',
  },
  {
    id: 'p2',
    title: 'Optimizing Neural Networks for Edge Devices',
    abstract: 'This paper explores novel quantization techniques to reduce the memory footprint of deep neural networks without significant loss in accuracy, specifically targeting IoT devices with limited compute resources.',
    content: `# Optimizing Neural Networks for Edge Devices

## Abstract
The proliferation of IoT devices necessitates efficient AI models. We propose "Q-Edge", a quantization framework.

## Methodology
We utilize post-training quantization combined with knowledge distillation. The teacher model is a ResNet-50, and the student is a MobileNetV3.

## Results
Our method achieves 4x compression with <1% accuracy drop on ImageNet.
    `,
    authors: [CURRENT_USER],
    status: PaperStatus.DRAFT,
    tags: ['Edge AI', 'Optimization', 'IoT'],
    citations: 0,
    coverImage: 'https://picsum.photos/seed/network/800/400',
  },
  {
    id: 'p3',
    title: 'The Future of Renewable Energy Storage: A Comprehensive Review',
    abstract: 'A deep dive into next-generation battery technologies, including solid-state and flow batteries, analyzing their economic viability and scalability for grid-level storage.',
    content: `# The Future of Renewable Energy Storage

## 1. Introduction
Energy storage is the bottleneck of the renewable revolution. This review covers the state of the art in 2024.

## 2. Solid State Batteries
Promising higher density and safety, but manufacturing costs remain high.

## 3. Flow Batteries
Ideal for stationary storage due to decoupled power and energy capacity.
    `,
    authors: [{ id: 'u3', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/100/100', affiliation: 'MIT Energy Initiative' }],
    status: PaperStatus.PUBLISHED,
    publishDate: '2024-01-15',
    tags: ['Energy', 'Sustainability', 'Engineering'],
    citations: 89,
    coverImage: 'https://picsum.photos/seed/energy/800/400',
  }
];
