import dynamic from 'next/dynamic'

const Personagem = dynamic(() => import('./personagem'));
const Periodo = dynamic(() => import('./periodo.js'));
const Evento = dynamic(() => import('./evento.js'));

export default function Barra ({props}) {

    //console.log(props.livro);
    const livro = props.livro;

    /*Prepare periods with an index*/
    
    return (
        <div className="barra">
            <div className="linha"></div>
            {livro.map((el) => {
                return (
                <div className={el.tipo} key={el.id}>
                    {el.tipo == 'personagem' && <Personagem obj={el}></Personagem>}
                </div> )
            })}
            <style jsx>{`
                .barra {
                    width: 100%;
                    height: ${props.containerL}px;
                    border: 1px solid blue
                    //box-sizing: border-box;
                }

                .linha {
                    width: 2rem;
                    height: 100%;
                    background-color: red;
                    position: relative;
                    left: 25%;
                    top: 0;
                }

                .personagem, .evento, .periodo {
                    border: 1px solid green;
                    max-width: fit-content;
                    position: relative;
                }
            `}</style>
        </div>
    )
}