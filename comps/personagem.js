export default function Personagem (props) {
    
    const p = props.obj;

    const date1 = new Date("-657", "11", "30")
    //console.log(date1.toDateString());
    const date1testTime = date1.getTime();
    //console.log(date1testTime);
    const date1backtest = new Date(date1testTime);
    //console.log(date1backtest);
    //console.log(p.data[0][1]);

    return (
        <div>
            <div className="date1">{p.data[0][0]}</div>
            <style jsx>{`
            
            
            
            `}</style>
        </div>
    )
}