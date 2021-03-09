
import dynamic from 'next/dynamic'
const Personagem = dynamic(() => import('../comps/personagem'));
const Periodo = dynamic(() => import('../comps/periodo.js'));
const Evento = dynamic(() => import('../comps/evento.js'));


export async function getStaticProps(context) {
    
    const livro = await import("../public/livro.json");

    return {
        props: {
            livro: livro.default
        }
    }
}

function Home(props){

    /* here ill calculate a size of the div using a yearSize instead of fixing a height and using proportions */
    const livro = props.livro;
    const inicialYear = livro[0].data[0][0];
    const finalYear = (livro[livro.length-1].data2 ? livro[livro.length-1].data2[0][0]: livro[livro.length-1].data[0][0]);
    const yearSize = 12;
    const containerL = (finalYear - inicialYear)*yearSize;

    return (
        <div className="out_container">
            <div className="container">
                {livro.map((el) => {
                    return (
                    <div className={el.tipo} key={el.id}>
                        {el.tipo == 'personagem' && <Personagem obj={el}></Personagem>}
                        Hello
                    </div> )
                })}
                <div className="linha"></div>
            </div>
            <style jsx>{`
                .out_container{
                    position: relative;
                }

                .container {
                    width: 100%;
                    height: ${containerL}px;
                    border: 1px solid blue
                }

                .linha {
                    width: 2rem;
                    height: 100%;
                    background-color: red;
                    position: absolute;
                    top:0;
                    left: 25%;
                }
            `}</style>

        </div>
    )
}

export default Home;