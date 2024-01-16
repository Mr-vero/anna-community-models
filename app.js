// No need to import anything since we won't use jQuery anymore

class PreviewIframe {
  constructor(url) {
    this.iframe_ = document.createElement('iframe');
    this.iframe_.id = 'preview-frame';
    this.iframe_.src = url;
    this.iframe_.name = 'preview-frame';
    this.iframe_.frameBorder = '0';
    this.iframe_.setAttribute('noresize', 'noresize');
  }

  appendToBody() {
    document.querySelector('#app').appendChild(this.iframe_);
  }

  calculateHeight() {
    const previewFrame = document.getElementById('preview-frame');
    previewFrame.style.height = `${window.innerHeight}px`;
  }
}

async function initPreview(url) {
  const response = await fetch(`${url}`, { method: 'GET' });
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  // Add styles here instead of manipulating head elements due to CORS restrictions
  const styleContent = `
    html, body {
      width: 100%;
      height: 100%;
      padding: 0px;
      margin: 0px;
      overflow: hidden;
      font-family: arial;
      font-size: 10px;
      color: #6e6e6e;
      background-color: #000;
    }
    #preview-frame {
      width: 100%;
      background-color: #fff;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styleContent;
  document.head.appendChild(styleEl);

  const iframe = new PreviewIframe(url);
  iframe.appendToBody();
  iframe.calculateHeight();

  window.addEventListener('resize', () => {
    iframe.calculateHeight();
  });

  window.addEventListener('load', () => {
    iframe.calculateHeight();
  });
}

initPreview('https://mrvero-notux-chat-ui.hf.space/');
