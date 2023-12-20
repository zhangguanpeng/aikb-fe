const closeIcon = 'data:image/png;base64,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';

/* eslint-disable no-param-reassign */
function destroyKnowledgeModal(modalElement, iframe){
    // 把iframe指向空白页面，这样可以释放大部分内存。
    iframe.src = 'about:blank';

    try{
        iframe.contentWindow.document.write('');
        iframe.contentWindow.document.clear();
    } catch(e) {
        //
    }
    
    // 把iframe从页面移除
    modalElement.parentNode.removeChild(modalElement);

}

function createKnowledgeModal(dom, src, onload) {
    const modalElement = document.createElement("div");
    // modalElement.style.padding = '10px';
    // modalElement.style.backgroundColor = 'lightblue';
    modalElement.style.position = 'fixed';
    modalElement.style.top = '50%';
    modalElement.style.left = '50%';
    modalElement.style.transform = 'translate(-50%, -50%)';
    modalElement.style.border = '1px solid lightgray';

    // 创建iframe
    const iframe = document.createElement("iframe");
    // 设置iframe的样式
    iframe.style.width = '600px';
    iframe.style.height = '600px';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.border = 'none';

    // 创建弹窗关闭按钮
    const closeElement = document.createElement("img");
    closeElement.src = closeIcon;
    closeElement.style.width = '24px';
    closeElement.style.height = '24px';
    closeElement.style.position = 'absolute';
    closeElement.style.top = '-10px';
    closeElement.style.right = '-10px';
    closeElement.style.zIndex = 999;
    closeElement.style.cursor = 'pointer';
    closeElement.onclick = () => { destroyKnowledgeModal(modalElement, iframe) };

    // 绑定iframe的onload事件
    if (onload && Object.prototype.toString.call(onload) === '[object Function]') {
        if (iframe.attachEvent) {
            iframe.attachEvent('onload', onload);
        } else if (iframe.addEventListener) {
            iframe.addEventListener('load', onload);
        } else {
            iframe.onload = onload;
        }
    }

    iframe.src = src;

    // 把iframe加载到modalElement下面
    modalElement.appendChild(closeElement);
    modalElement.appendChild(iframe);
    dom.appendChild(modalElement);
    return modalElement;
};


function createButton() {
    const knowledgeBtn = document.createElement("div");
    knowledgeBtn.innerHTML = "知识库";
    knowledgeBtn.style.padding = '10px';
    knowledgeBtn.style.backgroundColor = '#1677ff';
    knowledgeBtn.style.color = '#ffffff';
    knowledgeBtn.style.borderRadius = '20px 0px 0px 20px';
    knowledgeBtn.style.position = 'absolute';
    knowledgeBtn.style.bottom = '30%';
    knowledgeBtn.style.right = '2px';
    knowledgeBtn.style.cursor = 'pointer';
    knowledgeBtn.onclick = () => { createKnowledgeModal(document.body, 'https://www.runoob.com', () => {}); };
    document.body.appendChild(knowledgeBtn);
};

createButton();