function livro(req, res) {
    const livroJSON = fetch('livro.json');
    res.json(livroJSON);
}

export default livro;