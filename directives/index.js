const createAndFireEvent = function(eventName, elem) {
    var event = new Event(eventName);
    elem.dispatchEvent(event);
}
let touchstart

let touchmove
let touchend
const isTouch = typeof (window.ontouchstart) !== 'undefined'
if (isTouch) {
    touchstart = 'touchstart'
    touchend = 'touchend'
    touchmove = 'touchmove'
} else {
    touchstart = 'mousedown'
    touchend = 'mouseup'
    touchmove = 'mousemove'
}

function convertEvent(event) {
    return isTouch ? event.touches[0] : event
}

module.exports = {
    press: {
        inserted: function(el, binding) {
            let startTime
            const value = binding.value
            const triggerTime = binding.value ? binding.value * 1000 : 2000;

            el.addEventListener(touchstart, function() {
                startTime = new Date().getTime();
            })
            el.addEventListener(touchend, function(e) {
                var endTime = new Date().getTime();
                if (endTime - startTime > triggerTime) {
                    e.preventDefault();
                    if(typeof value === 'function'){
                        value();
                    }else{
                        createAndFireEvent('press', el)
                    }
                }
            })
        }
    },
    scroll:{
        inserted:function(){

        },
        componentUpdated: function(ele, binding){
            const value = binding.value;
            const scrollHeight = ele.scrollHeight - ele.clientHeight;
            const scrollWidth = ele.scrollWidth - ele.clientWidth;
            if(value){
                value.y && (ele.scrollTop = value.y < scrollHeight? value.y: scrollHeight)
                value.x && (ele.scrollLeft = value.x < scrollWidth? value.x: scrollWidth)
            }
        }
    },
    focus:{
        inserted:function(ele, binding){
            const scrollElement = document.getElementById(binding.value);
            let scrollTop;
            ele.addEventListener('click', function(){
            // window.addEventListener('resize', function(){
                setTimeout( ()=>{
                    scrollTop = scrollElement.scrollTop;
                    scrollElement.scrollTop = scrollElement.scrollHeight - scrollElement.clientHeight;
                },600)
                // }
            },false)
            ele.addEventListener('blur', function(){
                scrollElement.scrollTop = scrollTop;
            },false)

            // }, false)
        },
        distroy: function(){

        }
    },
    pull: {
        inserted(ele, binding) {
            let startY
            let top
            const callback = binding.value
            ele.addEventListener(touchstart, (event) => {
                const e = convertEvent(event)
                // startX = e.clientX
                startY = e.clientY
            }, false)

            ele.addEventListener(touchmove, (event) => {
                const scrollTop = ele.scrollTop

                const e = convertEvent(event)
                const endY = e.clientY
                top = (startY - endY) / 2
                if (top > 0 && top <= 100 && scrollTop <= 0) {
                    ele.style.transform = `translate(0px, -${top}px)`
                    ele.style.webkitTransform = `translate(0px, -${top}px)`
                }
            }, false)

            ele.addEventListener(touchend, () => {
                setTimeout(() => {
                    ele.classList.add('scroll-reset')
                    ele.style.transform = ''
                    setTimeout(() => {
                        ele.classList.remove('scroll-reset')
                        // ele.parentElement.children[0].children[1].innerHTML = '松开刷新'
                    }, 300)
                }, 300)
                if (top >= 100) {
                    top = 0
                    // ele.parentElement.children[0].children[1].innerHTML = '加载中...'
                    callback()
                }
            }, false)
        },
    },
}
