interface IMarca {
  nome: string;
}

class Marca implements IMarca {
  nome: string;
  constructor({ nome }: IMarca) {
    this.nome = nome;
  }
}

interface ICategoria {
  nome: string;
}

class Categoria implements ICategoria {
  nome: string;

  constructor({ nome }: ICategoria) {
    this.nome = nome;
  }
}

interface IProduto {
  nome: string;
  categoria: Categoria;
}

class Produto implements IProduto {
  nome: string;
  categoria: Categoria;

  constructor({ nome, categoria }: IProduto) {
    this.nome = nome;
    this.categoria = categoria;
  }
}

class Item {
  produto: Produto;
  marca: Marca;
  preco: number;
  quantidadeUnidades: number;

  constructor(marca, produto, preco, quantidadeUnidades) {
    this.marca = marca;
    this.produto = produto;
    this.preco = preco;
    this.quantidadeUnidades = quantidadeUnidades;
  }
}

interface IRegister {
  nome: string;
  categoria?: string;
  marca: string;
  preco: number;
  quantidadeUnidades: number;
}

class System {
  marcas: Marca[];
  produtos: Produto[];
  categorias: Categoria[];
  items: Item[];

  constructor() {
    this.marcas = [];
    this.produtos = [];
    this.categorias = [];
    this.items = [];
  }

  getCategoria(nome) {
    return this.categorias.find((value) => value.nome === nome);
  }

  getProduto(nome) {
    return this.produtos.find((value) => value.nome === nome);
  }

  getMarca(nome) {
    return this.marcas.find((value) => value.nome === nome);
  }

  // Retorna todos os items do mesmo produto
  getAllProducts(nome) {
    const produto = this.items.filter((item) => {
      return item.produto.nome === nome;
    });

    if (!produto)
      throw new Error(`Nenhum produto com o nome ${nome} foi encontrado`);
    return produto;
  }

  busqueOuRegistreCategoria(nome) {
    let category = this.categorias.find((value) => value.nome === nome);
    if (!category) {
      category = new Categoria({ nome });
      this.categorias.push(category);
    }

    return category;
  }

  busqueOuRegistreMarca(nome) {
    let brand = this.marcas.find((value) => value.nome === nome);

    if (!brand) {
      brand = new Marca({ nome });
      this.marcas.push(brand);
    }
    return brand;
  }

  register({ marca, categoria, nome, preco, quantidadeUnidades }: IRegister) {
    // Primeiro, buscar o produto pra ver se ele j?? existe
    let p = this.getProduto(nome);
    // Se n??o foi passado um produto
    if (!p) {
      //caso n??o tenha um produto registrado e n??a se tenha passado a categoria, vamos dar um erro
      // caso caia aqui o resto n??o vai ser executado
      if (!categoria)
        throw new Error(
          'Voc?? precisa passar uma categoria para registrar um novo produto'
        ); // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/throw aqui se voc?? quiser ver mais

      // precisamos ent??o salvar se n??o existir e buscar a categoria
      const newc = this.busqueOuRegistreCategoria(categoria);
      // fazer um novo produto e setar na nossa lista de produtos
      p = new Produto({ nome, categoria: newc });
      this.produtos.push(p);
    }
    // Depois desse if vamos ter um produto caso n??o tenha dado erro

    // Agora precisamos buscar a marca e registrar se ela n??o existe
    const m = this.busqueOuRegistreMarca(marca);

    const item = new Item(m, p, preco, quantidadeUnidades);
    this.items.push(item);
  }

  sortItems(nome) {
    const allProducts = this.getAllProducts(nome);
    allProducts.sort(
      (a, b) => a.preco / a.quantidadeUnidades - b.preco / b.quantidadeUnidades
    );
    return allProducts;
  }
}

const s = new System();

// Sendo a primeira vez que a gente p??e leite,
// ent??o temos que colocar sua categoria para ele ser registrado
s.register({
  nome: 'leite',
  categoria: 'alimento',
  marca: 'leitissimo',
  preco: 9.9,
  quantidadeUnidades: 1, //POR EXEMPLO, 1 LITRO
});

s.register({
  nome: 'leite',
  marca: 'betania',
  preco: 3.6,
  quantidadeUnidades: 1,
});

s.register({
  nome: 'leite',
  marca: 'itambe',
  preco: 2.99,
  quantidadeUnidades: 0.9,
});

s.register({
  nome: 'leite',
  marca: 'maria',
  preco: 10,
  quantidadeUnidades: 3,
});

s.register({
  nome: 'leite',
  marca: 'do bem',
  preco: 7,
  quantidadeUnidades: 1.2,
});

s.register({
  nome: 'carne',
  categoria: 'alimento',
  marca: 'friboi',
  preco: 30,
  quantidadeUnidades: 1000,
});

s.register({
  nome: 'carne',
  marca: 'carnissimo',
  preco: 29,
  quantidadeUnidades: 500,
});

console.log('TODOS OS PRODUTOS LEITE');
console.table(s.getAllProducts('leite'));

console.log('ORDENANDO POR PRE??O/VOLUME');
console.table(s.sortItems('leite'));

console.log('TODOS OS PRODUTOS CARNE');
console.table(s.getAllProducts('carne'));

console.log('ORDENANDO POR PRE??O/PESO');
console.table(s.sortItems('carne'));

console.log('BUSCANDO UM PRODUTO batata QUE N??O EXISTE');
console.log(s.getAllProducts('batata'));
