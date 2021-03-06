window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function init () {
  if (window.mobilecheck()) {
    const el = document.getElementById('terminal')
    el.innerHTML = '<div class="no-mobile">Mobile devices are not supported! 😭<br><br>Pull requests are welcome.</div>'
    console.warn('Doesn\'t work with mobil devices')
    return
  }
  const LS = '> ' // line start
  const NL = `\r\n`
  const PROMPT = `${NL}${LS}`
  const COLOR_RED = '\x1b[91m'
  const COLOR_CYAN = '\x1b[96m'
  const COLOR_WHITE = '\x1b[39m'
  const CLEARLINE = '\x1b[2K\r'
  let cmd = ''
  let lastCommand = ''
  const state = { path: '/' }
  const term = new window.Terminal()
  window.term = term

  term.open(document.getElementById('terminal'))

  function runFakeTerminal() {
    if (term._initialized) return
    term._initialized = true

    term.prompt = () => { term.write(PROMPT) }

    term.writeln('#!/bin/sh \x1B[2m- You\'re not in Kansas anymore!\x1B[22m')
    term.prompt()

    term.onKey(async e => {
      term.setOption('cursorBlink', false)
      
      // console.log('keyCode:', e.domEvent.keyCode)
      const keyCode = e.domEvent.keyCode
      const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey

      if (keyCode === 13) {
        if (cmd === '') {
          return term.write(`${PROMPT}`)
        }
        const [command, ...args] = cmd.split(' ')
        if (command === 'encrypt') {
          const msg = await encrypt(args.shift(), args.join(' '))
          console.log(msg)
          term.write(`${NL}key:   ${msg.key}${NL}value: ${msg.value}${NL}${PROMPT}`)
          lastCommand = cmd
          cmd = ''
          return
        } else if (command === 'clear') {
          term.write(CLEARLINE)
          cmd = ''
          term.clear()
          term.write(LS)
          // setTimeout(() => term.clear(), 20)
          return
        }
        const message = await exec(cmd.trim(), state)
        if (message !== false) {
          const sanitized = message.replace(/\n/g, '\r\n')
          term.write(`${NL}${sanitized}${PROMPT}`)
        } else {
          if (await exec(command, state)) {
            term.write(`${NL}${COLOR_RED}invalid argument(s) "${args}" for command: ${command}${COLOR_WHITE}${PROMPT}`)
          } else {
            term.write(`${NL}${COLOR_RED}unknown command: ${command}${COLOR_WHITE}${PROMPT}`)
          }
        }
        lastCommand = cmd
        cmd = ''  
      } else if (keyCode === 85 && e.domEvent.ctrlKey) {
        // CTRL + u
        term.write(`${CLEARLINE}${LS}`)
        cmd = ''
      } else if (keyCode === 8) {
        // Backspace
        if (term._core.buffer.x > LS.length) {
          cmd = cmd.slice(0, cmd.length - 1)
          term.write('\b \b')
        }
      } else if (keyCode === 9) {
        // ignore tabs
      } else if (keyCode === 40 || keyCode === 38) {
        // up / down
        if (keyCode === 38) {
          term.write(`${CLEARLINE}${LS}${lastCommand}`)
          cmd = lastCommand
        }
        if (keyCode === 40) {
          term.write(`${CLEARLINE}${LS}`)
          cmd = ''
        }
      } else if (printable) {
        term.write(e.key)
        cmd += e.key
      }
    })
  }

  runFakeTerminal()
  term.focus()
  term.setOption('cursorBlink', true)
}

init()
