(function () {
  const LS = '$ ' // line start
  const NL = `\r\n${LS}`
  let cmd = ''
  var term = new window.Terminal()
  term.open(document.getElementById('terminal'))

  function runFakeTerminal() {
      if (term._initialized) return
      term._initialized = true

      term.prompt = () => {
          term.write(NL)
      }

      term.writeln('Welcome to xterm.js')
      term.writeln('This is a local terminal emulation, without a real terminal in the back-end.')
      term.writeln('Type some keys and commands to play around.')
      term.writeln('')
      term.prompt()

      term.onLineFeed(e => {
        if (cmd !== '') {
          console.log('command:', cmd)
        }
        cmd = ''
      })

      term.onKey(e => {
        // console.log('keyCode:', e.domEvent.keyCode)
        const keyCode = e.domEvent.keyCode
        const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey

        if (keyCode === 13) {
          // return
          term.prompt()
        } else if (keyCode === 85 && e.domEvent.ctrlKey) {
          term.write(`\x1b[2K\r${LS}`)
        } else if (keyCode === 8) {
          // Backspace
          if (term._core.buffer.x > LS.length) {
            term.write('\b \b')
          }
        } else if (keyCode === 40 || keyCode === 38) {
          // up / down
        } else if (printable) {
          term.write(e.key)
          cmd += e.key
        }
      })
  }

  runFakeTerminal()
})()
