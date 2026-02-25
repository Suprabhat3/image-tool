# ImageTool: Power & Privacy, On-Device.

ImageTool is a modern, blazingly fast Next.js application designed to compress, resize, and crop your images without ever communicating with a server. It runs entirely within your browser utilizing cutting-edge Web APIs, ensuring that your privacy is truly maintained and loading spinners are eliminated.

![ImageTool Preview](/public/image-logo.png)

## Features

- **100% Client-Side Engine**: Performs heavy image processing directly through your hardware's CPU/GPU. No backend servers, no queues.
- **Zero-Trust Privacy**: Since processing is local to your browser, your files are never uploaded, intercepted, or saved to any cloud database.
- **Flawless Formatting**: Read standard files (JPEG, PNG, GIF, WEBP) and convert natively into highly-optimized forms with a precise MB/KB target.
- **Instantaneous Speeds**: Without network transit hold-ups, large high-res images edit and export instantly.
- **Intelligent Cropping**: Easily slice or adjust the aspect ratio of photos using the built-in, fluid `react-easy-crop` canvas.

## Tech Stack

This project was built leveraging the following core technologies for a smooth, app-like experience:

- **Framework**: `Next.js 15` (App Router)
- **Library**: `React 19`
- **Styling**: `Tailwind CSS 4.0`
- **Icons**: `lucide-react`
- **Image Processing**: `react-easy-crop` and `browser-image-compression`

## Getting Started

First, ensure you have a node environment with `npm`, `yarn`, or `pnpm` installed.

1. Clone or download the repository to your local machine.
2. Install the necessary dependencies into your workspace.

```bash
pnpm install
```

3. Fire up the development server!

```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application live!

## How It Works

1. Head to the homepage, and simply **drag and drop** the uncompressed image you want to fix up.
2. You'll enter the **Image Editor**. Re-frame your picture or restrict it to specific crop aspects (like 16:9 or 1:1).
3. Drag the range sliders to command a specific max output size and quality target.
4. Click **Apply & Save** to initiate the local client conversion. A preview screen validates your success, showing precisely how much space you have recovered. Click **Download**, and you'll drop the finalized image straight into your folder!

---

_Built securely and efficiently, precisely for your everyday image tweaking._
