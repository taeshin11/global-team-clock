// Feedback Widget for Global Team Clock
(function () {
  'use strict';

  const FEEDBACK_TRANSLATIONS = {
    EN: { title: 'Send Feedback', placeholder: 'Your message...', submit: 'Send', close: 'Close' },
    KO: { title: '피드백 보내기', placeholder: '메시지를 입력하세요...', submit: '보내기', close: '닫기' },
    JA: { title: 'フィードバックを送る', placeholder: 'メッセージを入力...', submit: '送信', close: '閉じる' },
    ZH: { title: '发送反馈', placeholder: '您的消息...', submit: '发送', close: '关闭' },
    ES: { title: 'Enviar comentarios', placeholder: 'Tu mensaje...', submit: 'Enviar', close: 'Cerrar' },
    DE: { title: 'Feedback senden', placeholder: 'Ihre Nachricht...', submit: 'Senden', close: 'Schließen' },
    FR: { title: 'Envoyer un commentaire', placeholder: 'Votre message...', submit: 'Envoyer', close: 'Fermer' },
    PT: { title: 'Enviar feedback', placeholder: 'Sua mensagem...', submit: 'Enviar', close: 'Fechar' }
  };

  function getLang() {
    if (typeof I18n !== 'undefined' && I18n.getLang) {
      return I18n.getLang();
    }
    return 'EN';
  }

  function getT() {
    const lang = getLang();
    return FEEDBACK_TRANSLATIONS[lang] || FEEDBACK_TRANSLATIONS['EN'];
  }

  function createWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #gtc-feedback-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #14B8A6;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(20,184,166,0.4);
        z-index: 9999;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #gtc-feedback-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(20,184,166,0.5);
      }
      #gtc-feedback-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        z-index: 10000;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 80px 24px 24px 24px;
      }
      #gtc-feedback-modal {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        width: 300px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        position: relative;
      }
      #gtc-feedback-modal h3 {
        font-size: 15px;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 12px 0;
      }
      #gtc-feedback-modal textarea {
        width: 100%;
        height: 90px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 8px;
        font-size: 13px;
        resize: vertical;
        outline: none;
        font-family: inherit;
        box-sizing: border-box;
      }
      #gtc-feedback-modal textarea:focus {
        border-color: #14B8A6;
      }
      #gtc-feedback-submit {
        margin-top: 10px;
        width: 100%;
        padding: 9px;
        background: #14B8A6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }
      #gtc-feedback-submit:hover { background: #0f9e8e; }
      #gtc-feedback-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #9ca3af;
        line-height: 1;
        padding: 2px 6px;
      }
      #gtc-feedback-close:hover { color: #374151; }
    `;
    document.head.appendChild(style);

    // Floating button
    const btn = document.createElement('button');
    btn.id = 'gtc-feedback-btn';
    btn.setAttribute('aria-label', 'Open feedback');
    btn.textContent = '💬';
    document.body.appendChild(btn);

    // Overlay + modal
    const overlay = document.createElement('div');
    overlay.id = 'gtc-feedback-overlay';
    overlay.style.display = 'none';

    const modal = document.createElement('div');
    modal.id = 'gtc-feedback-modal';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function render() {
      const t = getT();
      modal.innerHTML = `
        <button id="gtc-feedback-close" aria-label="Close">&times;</button>
        <h3>${t.title}</h3>
        <textarea id="gtc-feedback-textarea" placeholder="${t.placeholder}"></textarea>
        <button id="gtc-feedback-submit">${t.submit}</button>
      `;
      document.getElementById('gtc-feedback-close').addEventListener('click', closeModal);
      document.getElementById('gtc-feedback-submit').addEventListener('click', submitFeedback);
    }

    function openModal() {
      render();
      overlay.style.display = 'flex';
    }

    function closeModal() {
      overlay.style.display = 'none';
    }

    function submitFeedback() {
      const msg = (document.getElementById('gtc-feedback-textarea').value || '').trim();
      const subject = encodeURIComponent('[Global Team Clock] Feedback');
      const body = encodeURIComponent(msg);
      window.location.href = `mailto:taeshinkim11@gmail.com?subject=${subject}&body=${body}`;
      closeModal();
    }

    btn.addEventListener('click', openModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Also hook the existing footer feedback button if present
    const existingBtn = document.getElementById('feedback-btn');
    if (existingBtn) {
      existingBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
