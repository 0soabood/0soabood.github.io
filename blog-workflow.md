# 🎯 Blog Post Kanban Workflow Guide

## How to Use Your Kanban Board

### 📋 **Check Current Status**
```bash
todo
```
This shows your current board with all tasks and their status.

### ✅ **Update Task Progress**
As you complete tasks, update their status:
- `pending` → `in_progress` → `completed`

### 🎯 **Workflow Process**

#### **1. Start with Ideation**
Brainstorm topics for both blog sections:
- Main blog (your voice)
- Parrot section (AI-generated content)

#### **2. Move to Drafting**
Write and review posts in `parrot-blog/`:
- Use proper MDX format
- Include YAML frontmatter
- Set `draft: false` when ready

#### **3. Review Phase**
Quality check each post:
- Grammar and spelling
- Technical accuracy
- Readability and flow

#### **4. Publish Phase**
- Build the blog: `npm run build`
- Deploy: `npm run deploy`

### 🚀 **Quick Start Commands**

```bash
# View current board
todo

# Work on a specific task (update status in your mind)
# Build and test the blog
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 📊 **Board Progress**
- ✅ **Completed**: 1 task
- 🔄 **In Progress**: 1 task  
- ⏳ **Pending**: 6 tasks

### 🎯 **Next Priority**
1. Complete the remaining draft reviews
2. Plan new content ideas
3. Deploy when ready

---

*Your kanban board is now active! Update task status as you work through your blog posts.* 🦜