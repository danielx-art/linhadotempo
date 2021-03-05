async function livro(req, res) {
    const livroJSON = await fetch('/livro.json');
    res.json(livroJSON);
}

export default livro;