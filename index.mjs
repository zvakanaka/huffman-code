// THANK YOU: https://asecuritysite.com/Coding/huff
import colorJson from 'color-json'
const str = process.argv[2] || 'hello world'

const freqs = str.split('').reduce((acc, ch) => {
  const foundIndex = acc.findIndex((item) => item.symbol === ch)
  if (foundIndex > -1) {
    acc[foundIndex].frequency++
  } else {
    acc.push({
      symbol: ch, frequency: 1,
    })
  }
  return acc
}, []).sort(sortByFreqDesc)

function sortByFreqDesc(a, b) {
  return b.frequency - a.frequency
}
console.log('Frequencies:')
console.log(freqs)

// TODO: make the next functions pure (most of this was done on my phone in Termux vim while on vacation, so shortcuts were taken)
function addNewNode() {
  if (freqs.length === 1) {
    return
  }
  const newNode = {}
  const lastFreq = freqs.pop()
  const lastFreqButOne = freqs.pop()

  newNode.leftChild = lastFreq
  newNode.rightChild = lastFreqButOne

  newNode.frequency = (lastFreq?.frequency || 0) + (lastFreqButOne?.frequency || 0)
  freqs.push(newNode)
  freqs.sort(sortByFreqDesc)
  addNewNode()
}
addNewNode()

function addCodes(node) {
  delete node.frequency
  if (node.leftChild) {
    node.leftChild.code = (node.code || '') + '0'
    addCodes(node.leftChild)
  }
  if (node.rightChild) {
    node.rightChild.code = (node.code || '') + '1'
    addCodes(node.rightChild)
  }
}
addCodes(freqs[0])
console.log('Tree:')
console.log(colorJson(freqs))

function getHuffmanCodes() {
  const codes = []
  function traverseTree(node) {
    if (!node.leftChild && !node.rightChild) {
      codes.push({ symbol: node.symbol, code: node.code })
    } else {
      traverseTree(node.leftChild)
      traverseTree(node.rightChild)
    }
  }
  traverseTree(freqs[0])
  return codes
}
const huffmanCodes = getHuffmanCodes()

console.log('Huffman codes:')
console.log(huffmanCodes)

const encodedStr = str.split('').map((ch) => {
  const code = huffmanCodes.find((item) => item.symbol === ch).code
  return code
}).join('')
console.log(`encoded (${encodedStr.length} bits, ${Math.ceil(encodedStr.length / 8)} bytes):`)
console.log(encodedStr)

const decodedStr = encodedStr.split('').reduce((acc, ch) => {
  const found = huffmanCodes.find((item) => item.code === acc.temp + ch)
  if (found) {
    acc.temp = ''
    acc.decoded += found.symbol
  } else {
    acc.temp += ch
  }
  return acc
}, { temp: '', decoded: '' }).decoded
console.log('decoded:')
console.log(decodedStr)
