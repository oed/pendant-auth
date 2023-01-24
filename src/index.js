import { listKeys, ethSignMessage, parseURLParams } from 'halo-chip'
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'


let address, did, slot, session

async function getDID () {
  const keys = await listKeys()
  address = keys[0].address
  did = keys[0].did
  slot = keys[0].slot
  document.getElementById('did-span').textContent = did
  document.getElementById('auth').style.display = 'block'
  document.getElementById('soul-span').textContent = is3soul(did) ? 'Is a 3soul' : 'Is no 3soul'
  document.getElementById('did-button').disabled = true
}

async function auth () {
  const provider = {
    request: async ({ method, params }) => ethSignMessage(params[0], slot, params[1])
  }
  const accountId = { address: address.toLowerCase(), chainId: { reference: 1, namespace: 'eip155' } } // this is annoying
  const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId)
  session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })

  document.getElementById('sign').style.display = 'flex'
  document.getElementById('auth-button').disabled = true
}

async function sign () {
  const text = document.getElementById('payload').value
  console.log('t', text)
  const signed = await session.did.createDagJWS({ text })
  document.getElementById('signature-span').textContent = JSON.stringify(signed)
}

function parseParams () {
  const { keys } = parseURLParams(window.location.search)
  if (keys) {
    address = keys[0].address
    did = keys[0].did
    slot = keys[0].slot
    document.getElementById('did-span').textContent = did
    document.getElementById('auth').style.display = 'block'
  }
}

function toggleHackInfo () {
  const isVisible = document.getElementById('hackinfo').style.display !== 'none'
  document.getElementById('hackinfo').style.display = isVisible ? 'none' : 'block'
}

window.onload = () => {
  document.getElementById('hackathon').addEventListener('click', toggleHackInfo)
  document.getElementById("did-button").addEventListener("click", getDID);
  document.getElementById("auth-button").addEventListener("click", auth);
  document.getElementById("sign-button").addEventListener("click", sign);
  document.getElementById("payload").addEventListener("keypress", ({ key }) => {
    if (key === 'Enter') {
      sign()
    }
  });
  parseParams()
}

const is3soul = (did) => PENDANTS.includes(did)

const PENDANTS = [
  'did:pkh:eip155:1:0x2bf55f2fb8d6a7c2da6148a1ff692c800e6bd447',
  'did:pkh:eip155:1:0x88e2bd66e78b870628a562e7476db9587d9c4b8c',
  'did:pkh:eip155:1:0x4e0ac2c2568e2388487b4a3043fdaecaab62f31e',
  'did:pkh:eip155:1:0xe1e09ea40a4da2fafcdb8f7e0968b1c3ddb74bfb',
  'did:pkh:eip155:1:0x1f5a4d4d53db260411060c3df379caa6d0b4b51c',
  'did:pkh:eip155:1:0xc822e80c4885498dbf2ed48109e6451168ac7904',
  'did:pkh:eip155:1:0x53122f315a307226bf1ed8b22d9ee979ae74ffbc',
  'did:pkh:eip155:1:0xf110432d99545872c9d8cd49aff0b473300e56dd',
  'did:pkh:eip155:1:0x64cf37dcc4f4302a2ecdcc4da77bf528042f7edb',
  'did:pkh:eip155:1:0xb9d55f23e44a61901ea2342cf9ef4b18638ddc6b',
  'did:pkh:eip155:1:0x2906140d27c396531a5e696706245cb14ae6325d',
  'did:pkh:eip155:1:0x6ddbd2675c20b5a67bee0c37504b8062cdb30ceb',
  'did:pkh:eip155:1:0x363aeaa08700837c8bdd797d4f2d3d6c971b1b10',
  'did:pkh:eip155:1:0xda7a86622416f9e239c936709efc1aaf34b24ae0',
  'did:pkh:eip155:1:0x5fde4577afa4f5618e8c3f1fa0f60cdb0d7c866c',
  'did:pkh:eip155:1:0x4c2a21ef7d9ca64e507cf23321c2287c88a956e7',
  'did:pkh:eip155:1:0x5f006ac69fcf378a0cdebe699a9fa0bbc60e83ac',
  'did:pkh:eip155:1:0x823c7b5933097fedb12c8ff8d2d18c47bbfed647',
  'did:pkh:eip155:1:0x0662cb1f9ffe68f2e12475b0f6a19332f0e99c04',
  'did:pkh:eip155:1:0xa72e1472ccedab9d9923e942557458a0143f9c1c',
  'did:pkh:eip155:1:0xca7d100477e3afd8db9c2bf235f71ac7f53302c9',
  'did:pkh:eip155:1:0x00357321634b6dee31e2a5aa517521db9df4cf42',
  'did:pkh:eip155:1:0x84246c4a9584af327abca915b597a0b9ec4664ed',
  'did:pkh:eip155:1:0xbc40f9c55edbcdee585ff852a6824f7ba430d486',
  'did:pkh:eip155:1:0x0bb9a317842241eb63ae46d693d046238e2d1b27',
  'did:pkh:eip155:1:0xcd8bb6606d7a6b422f1726a9320a272fbc1edbdf',
  'did:pkh:eip155:1:0xa4d5038d479eeda593d02d3a81b66d01b70b88d2',
  'did:pkh:eip155:1:0xcf361fac21cf756a36e1dfeaeafb3c1450ad541c',
  'did:pkh:eip155:1:0xa13e0f6c5d8509439ce0c74085ba859c3692c12f',
  'did:pkh:eip155:1:0x98d2329b6981627538222157c8df2794a4516af6',
]
