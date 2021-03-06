import livroJSON from '../../public/livro.json';

function livro(req, res) {

    res.json(livroJSON);
    return;
}

export default livro;