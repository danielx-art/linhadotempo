import livro from '../public/livro.json';

function Home(){

    console.log(livro);

    return (
        <div>
            {livro.map((el) => {
                return <div key={el.id} >{el.tipo}</div>
            })}
        </div>
    )
}

export default Home;