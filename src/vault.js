let cmdmap = {}
fetch('./src/cyphermap.json')
  .then(x => x.json())
  .then(x => {
    cmdmap = x
  })

function dfn (body, state = {}) {
  try {
    // console.log('dfn body:', body, state)
    const res = Function('return ' + body).call(state)
    // try {
    //   console.log('dfn res: ', res.call(state))
    // } catch (err) {
    //   console.error(err)
    // }
    return (typeof res === 'function') ? res.call(state) : res
  } catch (err) {
    // console.log('return body', err)
    return body // so you can use pure text as body
  }
}
  
async function exec (key, state) {
  const hash = await sdigest(key)
  if (!(hash in cmdmap)) return false
  const cypher = 'U2FsdGVkX1' + cmdmap[hash]
  const bytes  = CryptoJS.AES.decrypt(cypher, key)
  const body = bytes.toString(CryptoJS.enc.Utf8)
  return dfn(body, state)
}

async function encrypt (key, message) {
  const hash = await sdigest(key)
  const cypher = CryptoJS.AES.encrypt(message, key).toString()
  return { key: hash, value: cypher }
}

async function sdigest (message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex).slice(0, 8)
}
