import { listKeys, ethSignMessage } from 'halo-chip'
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
}

async function auth () {
  const provider = {
    request: async ({ method, params }) => {
    return ethSignMessage(params[0], slot, params[1])
    }
  }
  const accountId = { address: address.toLowerCase(), chainId: { reference: 1, namespace: 'eip155' } } // this is annoying
  const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId)
  session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })

  document.getElementById('sign').style.display = 'block'
}

async function sign () {
  const text = document.getElementById('payload').value
  console.log('t', text)
  const signed = await session.did.createDagJWS({ text })
  document.getElementById('signature-span').textContent = JSON.stringify(signed)
}

window.onload = () => {
  document.getElementById("did-button").addEventListener("click", getDID);
  document.getElementById("auth-button").addEventListener("click", auth);
  document.getElementById("sign-button").addEventListener("click", sign);
}

