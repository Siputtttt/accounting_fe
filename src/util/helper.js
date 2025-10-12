function getConsole() {
    if (typeof window !== 'undefined') {
        return window.console;
    }
    return global.console;
}
const console = getConsole();

function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}

const regex = /-(\w)/g;
const camelize = cached((str) => str.replace(regex, (_, c) => (c ? c.toUpperCase() : '')));

function removeNode(node) {
    if (node.parentElement !== null) {
        node.parentElement.removeChild(node);
    }
}

function insertNodeAt(fatherNode, node, position) {
    const refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
    fatherNode.insertBefore(node, refNode);
}

function inAWordCurrency(n) {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  n = Math.floor(n);

  if (n < 12) return " " + satuan[n];
  if (n < 20) return inAWordCurrency(n - 10) + " Belas";
  if (n < 100)
    return inAWordCurrency(Math.floor(n / 10)) + " Puluh" + inAWordCurrency(n % 10);
  if (n < 200) return " Seratus" + inAWordCurrency(n - 100);
  if (n < 1000)
    return inAWordCurrency(Math.floor(n / 100)) + " Ratus" + inAWordCurrency(n % 100);
  if (n < 2000) return " Seribu" + inAWordCurrency(n - 1000);
  if (n < 1000000)
    return (
      inAWordCurrency(Math.floor(n / 1000)) + " Ribu" + inAWordCurrency(n % 1000)
    );
  if (n < 1000000000)
    return (
      inAWordCurrency(Math.floor(n / 1000000)) + " Juta" + inAWordCurrency(n % 1000000)
    );
  if (n < 1000000000000)
    return (
      inAWordCurrency(Math.floor(n / 1000000000)) +
      " Milyar" +
      inAWordCurrency(n % 1000000000)
    );

  return "Angka terlalu besar";
}

export { insertNodeAt, camelize, console, removeNode, inAWordCurrency };
