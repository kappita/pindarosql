export class bloqueRima {
  palabra: string
  categoria: string
  rima: string
  primeraLetraRima: string
  restoRima: string
  constructor(word: string, category: string, rhyme: string) {
    this.palabra = word
    this.categoria = category
    this.rima = rhyme
    this.primeraLetraRima = rhyme[0]
    this.restoRima = rhyme.slice(1)
  }
}



function compararCategorias(palA: bloqueRima, palB: bloqueRima, catA: string, catB: string) {
  if ((palA.categoria == catB) && (palB.categoria == catA)){
    return true
  }
  if ((palA.categoria == catA) && (palB.categoria == catB)){
    return true
  }
  return false
}

export function identificadorRima(palA: bloqueRima, palB: bloqueRima) {
  if (compararCategorias(palA, palB, "a", "e")) {
    return 1
  }
  if (compararCategorias(palA, palB, "a", "g")) {
    return 1
  }
  if (palA.primeraLetraRima != palB.primeraLetraRima) {
    return 1
  } 
  if (palA.rima == palB.rima) {
    return 2
  } 

  if (compararCategorias(palA, palB, "a", "a")) {
    return 3
  }
  const rimaSimplA = simplDiptongo(palA)
  const rimaSimplB = simplDiptongo(palB)

  if (compararCategorias(palA, palB, "e", "e")) {
    const vocalesA = obtenerUltimasVocales(rimaSimplA)
    const vocalesB = obtenerUltimasVocales(rimaSimplB)
    if ((vocalesA[0] == "") || (vocalesB[0] == "") || (vocalesA[1] == "") || (vocalesB[1] == "")) {
      return 1
    }
    if ((vocalesA[0] == vocalesB[0]) && (vocalesA[1] == vocalesB[1])) {
      return 3
    }
    return 1
  }
  if (compararCategorias(palA, palB, "e", "g") || compararCategorias(palA, palB, "g", "g")) {
    if (obtenerUltimaVocal(rimaSimplA) == obtenerUltimaVocal(rimaSimplB)) {
      return 3
    }
    return 1
  }
  return 4
  



}

function obtenerUltimaVocal(palabra: string) {
  if (['a', 'e', 'i', 'o', 'u'].includes(palabra[palabra.length - 1])) {
    return palabra[palabra.length - 1]
  }
  return palabra[palabra.length - 2]
}

function obtenerUltimasVocales(palabra: string) {
  let vocalA = ""
  let vocalB = ""
  let reverseString = "";
  for (let char of palabra) {
    reverseString = char + reverseString;
  }
  let firstFound = false
  for (let char of reverseString) {
    if (['a', 'e', 'i', 'o', 'u'].includes(char)) {
      if (!firstFound) {
        vocalA = char
        firstFound = true
      } else {
        vocalB = char
        return [vocalA, vocalB]
      }
    }
  }
  return [vocalA, vocalB]
}


function simplDiptongo(palabra: bloqueRima) {
  let restoRima = palabra.restoRima
  const diptongos = ["ai", "au","ua","ia","ei","eu","ue","ie","oi","ou","io","uo","iu","iu","ui"]
  const vocales = ["a","a","a","a","e","e","e","e","o","o","o","o","i","u","u"]
  for (let i = 0; i < diptongos.length; i++) {
    for (let j = 0; j < vocales.length; j++) {
      restoRima = restoRima.replace(diptongos[i], vocales[j])
      break
    }
  }
  return restoRima
}

