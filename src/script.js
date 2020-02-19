function init () {
  const LS = '$ ' // line start
  const NL = `\r\n`
  const PROMPT = `${NL}${LS}`
  const COLOR_RED = '\x1b[91m'
  const COLOR_WHITE = '\x1b[39m'
  const CLEARLINE = '\x1b[2K\r'
  let cmd = ''
  let lastCommand = ''
  const term = new window.Terminal()

  term.open(document.getElementById('terminal'))

  function runFakeTerminal() {
    if (term._initialized) return
    term._initialized = true

    term.prompt = () => {
        term.write(PROMPT)
    }

    term.writeln('#!/bin/bash - \x1B[2m Follow the white rabbit!\x1B[22m')
    term.prompt()

    term.onLineFeed(async (e) => {
    })

    term.onKey(async e => {
      // console.log('keyCode:', e.domEvent.keyCode)
      const keyCode = e.domEvent.keyCode
      const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey

      if (keyCode === 13) {
        const message = await exec(cmd.trim())
        if (message) {
          const sanitized = message.replace(/\n/g, '\r\n')
          term.write(`${NL}${sanitized}${PROMPT}`)
        } else {
          const [command, ...args] = cmd.split(' ')
          if (await exec(command)) {
            term.write(`${NL}${COLOR_RED}unknown arguments "${args}" for command: ${command}${COLOR_WHITE}${PROMPT}`)
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
      } else if (keyCode === 40 || keyCode === 38) {
        // up / down
        if (keyCode === 38) {
          term.write(`${CLEARLINE}${LS}${lastCommand}`)
          cmd = lastCommand
        }
      } else if (printable) {
        term.write(e.key)
        cmd += e.key
      }
    })
  }

  runFakeTerminal()
  term.focus()
}

init()
