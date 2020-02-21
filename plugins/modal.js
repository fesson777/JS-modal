// beforeClose(): boolean |  true = можно закрыть окно, false =  незакрывается
// ** animateCSS
// */

/*
* 1. Динамически на основе массива вывести список карточек
* 2. Показать цену в модалке (и это должна быть 1 модалка)
* 3. Модалка для удаления с 2мя кнопками
* ---------
* 4. На основе $.modal нужно сделать другой плагин $.confirm (Promise)
* */

Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling)
}

function noop () {}


function _createModalFooter(buttons = []) {
    if(buttons.length === 0) {
        return document.createElement('div')
    }

    const wrap = document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn => {
        const $btn = document.createElement('button')
        $btn.textContent = btn.text
        $btn.classList.add('btn')
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.onclick = btn.handler || noop

        wrap.appendChild($btn)
    })

    return wrap
}

function _createModal (options) {
    const modal = document.createElement('div');
    modal.classList.add('vmodal');
    modal.insertAdjacentHTML('afterbegin', `   
            <div class="modal-overlay" data-close = "true">
                <div class="modal-window style = "width: ${options.width || "600px"}">
                    <div class="modal-header">
                        <span class="modal-title">${options.title || "Window"}</span>
                        ${options.closable ? `<span class="modal-close" data-close = "true">&times;</span>` : '' } 
                    </div>
                    <div class="modal-body" data-content>
                       ${options.content || ''}                        

                    </div>
                      
                </div>
            </div>
    `)
    const footer =_createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
}





$.modal = function(options) {
    const $modal = _createModal(options);
    const ANIMATION_SPEED = 200;
    let closing = false;
    let destroyed = false; 
    
    const modal = {
        open() {
            if(destroyed) {return console.log('Modal destroyed') }
            !closing && $modal.classList.add('open')
            
        },
        close() {
            closing = true;
            $modal.classList.remove('open');
            $modal.classList.add('hide')            
            setTimeout(() => {
              $modal.classList.remove('hide');
              closing = false;
            }, ANIMATION_SPEED);
        }
    }
    

listener = event => {
    if(event.target.dataset.close) {
        modal.close()
    }
}

$modal.addEventListener('click', listener)
    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal)
            destroyed = true
            $modal.removeEventListener('click', listener)
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        }
    }) 
}

// const value = document.getElementById('inputID')
// value.addEventListener('change', () => {
// return value.text 
// })

// console.log(value)


