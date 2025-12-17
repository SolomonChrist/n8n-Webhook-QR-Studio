# n8n Webhook QR Studio

A minimal, production-clean web app to generate scannable, brandable QR codes from n8n webhook URLs.

## Features

- **Real-time Validation**: Instantly validates URLs with visual feedback (debounced).
- **Test Webhook**: Integrated tool to trigger GET requests and verify webhooks directly.
  - Includes timeout protection (10s) and response preview.
- **Branding Suite**:
  - **Frame Presets**: 8 professional frame designs (A1–A8) plus a clean 'None' option.
  - **Advanced Color Control**: Full hex manual entry + native color picker for frames.
  - **Corner Styles**: Toggle between **Classic**, **Rounded**, and **Bold** frame corners.
  - **Custom Captions**: Add up to 40 characters of text to your QR code frame.
- **Export Options**: 
  - **PNG**: High-resolution framed raster for digital use.
  - **SVG**: Pure vector QR code for professional design scaling.
  - **PDF**: Letter-sized print-ready document with framed QR and metadata.
- **Privacy Focused**: Client-side only. No tracking, no backend.

## Design Philosophy

This app prioritizes **scan reliability**. Every frame preset includes a built-in "Quiet Zone" (padding) around the QR code to ensure it remains scannable by all mobile devices regardless of the frame design or corner style.

## How to Run Locally

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install react react-dom lucide-react qrcode.react jspdf html-to-image
    ```
3.  Start the development server.

## License

MIT License

Copyright (c) 2025 Solomon Christ (https://www.solomonchrist.com)