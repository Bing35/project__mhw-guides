const { useState, useEffect } = React

function App(props) {
    const [monsterId, setMonsterId] = useState(36)
    const [monster, setMonster] = useState(undefined)
    let list = []

    function render() {
        if (monster === undefined) {
            return 'loading'
        }
        else {
            return (
                <div>
                    <header>
                        <Nav setMonsterId={setMonsterId} />
                    </header>
                    <Title name={monster.name} />
                    <Stats monster={monster} />
                </div>

            )
        }

    }

    // fetch data for monster
    useEffect(function () {
        fetch('https://mhw-db.com/monsters/' + monsterId)
            .then(response => response.json())
            .then(response => {
                setMonster(response)
            })
    }, [monsterId])

    // change document title
    useEffect(function () {
        if (monster === undefined) { return }
        document.title = monster.name
    }, [monster])


    return render()

}



function Nav(props) {
    const [search, setSearch] = useState('')
    const [monsters, setMonsters] = useState(undefined)
    let monsterList = []
    const invalidInput = [{
        'name': 'invalid input',
        'id': 1
    }]

    function render() {

        return (
            <div>
                <input type="text" onChange={changeSearch} value={search} />
                <ul>
                    {monsterList}
                </ul>
            </div>
        )
    }

    // fetch data for monsters
    useEffect(function () {
        if (search === '') {
            // clear ajax problem
            setTimeout(() => {
                setMonsters(undefined)
            }, 500);
            return
        }
        fetch(`https://mhw-db.com/monsters?q={"name": {"$like": "%${search}%"}}`)
            .then(response => response.json())
            .then(response => {
                // verify if it is list
                if (response.length === undefined) {
                    console.log('error');
                    setMonsters(invalidInput)
                    return
                }

                setMonsters(response)
            })

    }, [search])


    function setMonsterId(e) {
        props.setMonsterId(e.target.dataset.id)
        setSearch('')
    }


    if (monsters === undefined) {
        monsterList = []
    }
    else {
        monsterList = monsters.map(item => (
            <li key={item.name} ><button onClick={setMonsterId} data-id={item.id}>{item.name}</button></li>
        ))
    }

    function changeSearch(e) {
        setSearch(e.target.value)
    }

    return render()
}

function Title(props) {
    return (
        <h2>{props.name}</h2>
    )
}

function Stats(props) {
    return (
        <div id='stats' className='row'>
            {/* parts dmg sever, blunt, range */}
            <table>
            </table>

            {/* elemental parts dmg */}
            <table>

            </table>

            {/* ailments it deals */}
            <table className='col-lg-4'>
                <thead>
                    <tr><th>Ailments</th></tr>
                </thead>
                <tbody>
                    {props.monster.ailments.map((ailment) => (
                        <tr key={ailment.name}><td>{ailment.name}</td></tr>
                    ))}
                </tbody>
            </table>

            {/* locations */}
            <table className='col-lg-4'>
                <thead>
                    <tr>
                        <th>Location</th><th>Zone</th>
                    </tr>
                </thead>
                <tbody>
                    {props.monster.locations.map(location => (
                        <tr key={location.name}>
                            <td>{location.name}</td><td>{location.zoneCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}




ReactDOM.render(<App />, document.querySelector('#root'))