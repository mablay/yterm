const cmdmap = {
  'c7b68ac3': 'U2FsdGVkX1+L+/eXrSv01B57MiI2M9l+EwdRecYKiaKd3IaPdXOtAC0fmtR7/Ex/62eGOfFuzC+gQSkHmGMDYQ==',
  '106a5842': 'U2FsdGVkX1+0TRQkvcAucD4oAymjBKpckbXMAbpjyzklvxzpFRbL8XNUf7/E++MA',
  'c44f79ec': 'U2FsdGVkX1+1KiPS8eooOIGPLgqgJOQjFB1bLG7lqTOeuICEjCcK9EEnH3LjZefwesxCn1COPCIZrFsZ8gELm8op7EtugaN4LszJ7K6TCYi0qV2OAx3leT1iwJt4PYufOCAb/3vmy9CM/JDP9CykDeF+D+lCEhHqC0uXSdaFJrwniM4c7Y4+j2gr9FoMn9eGe9GsjzOHTWot08H4B/0n0Z9VrEcLCycJt4PXagaP8XVCK7ofz/a7geQYSWkpRAr6HlALsapI5GBXheDCIDtGrdU90BNsR6pOEuLh1rdMImYIcOcE0Nzexw4YjtWf8H9LCG5Om4CCjGaPk99d+LAYtX8FCjpFLWujfd8wMWzxlyYyBVASFUVsHvcmn98UTIUUtzQE5z6s75D4Vxs9ZATIIOrhHEJcYrv5fhFrL2HROFAhgI8aCiucyanhfYNIqYmI/ZH3zx0zwDPfwS7mJeRWjsaBNy/YbeRgx1K7uDDhPpXAWJiD1TzFAAXNqdfS+MIPa07meaY2Gq6DoIVde+rqbvaJfEa0LuqEsftGReiMOBMf6DP0wQ/ELGFJhwUtd4X+ujpTaL0nyDeULd3gjQlcUr15VRfI43SVYjsf1zq6koY=',
  'a1159e9d': 'U2FsdGVkX1+eXl+eAGO9+NitY1coSFYC+gi0iL2i9gw=',
  '5c0be87e': 'U2FsdGVkX18i3SRrpuwUGCm6//hdsrgUzTme9tM+sUQ=',
  '2c26b46b': 'U2FsdGVkX1+vungL40Ncb61o34O8/Hh693V1Rc5ajSo=',
  '3400bb49': 'U2FsdGVkX19iLFyu2RlGRte2cvS+BsvDGI6tiM+0BKg='
}

async function exec (key) {
  const hash = await sdigest(key)
  if (!(hash in cmdmap)) return false
  const cypher = cmdmap[hash]
  const bytes  = CryptoJS.AES.decrypt(cypher, key)
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function encrypt (key, message) {
  const hash = await sdigest(key)
  const cypher = CryptoJS.AES.encrypt(message, key).toString()
  return `'${hash}': '${cypher}'`
}

async function sdigest (message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex).slice(0, 8)
}
