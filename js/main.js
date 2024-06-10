class Carta {

    constructor(numero, palo) {
        this.numero = numero
        this.palo = palo
        this.destapada = false
        this.valor = this.darValor(numero, palo)
    }

    getCarta() {
        if (this.destapada == false) {
            return '##'
        } else {
            return (this.numero + this.palo)
        }
    }

    getCartaEnMano() {
        console.log(this.numero + this.palo)
    }

    taparCarta() {
        this.destapada = false
    }

    destaparCarta() {
        this.destapada = true
    }

    darValor(numero, palo) {
        if (numero == 1 && palo == '⚔️') {
            return 14
        }
        if (numero == 1 && palo == '🌴') {
            return 13
        }
        if (numero == 7 && palo == '⚔️') {
            return 12
        }
        if (numero == 7 && palo == '🪙') {
            return 11
        }
        if (numero == 3 || numero == 2) {
            return (numero + 7)
        }
        if (numero == 1 && (palo == '🪙' || palo == '🍷')) {
            return 8
        }
        if (numero == 12 || numero == 11 || numero == 10) {
            return (numero - 5)
        }
        if (numero == 7 && (palo == '🌴' || palo == '🍷')) {
            return 4
        }
        if (numero == 6 || numero == 5 || numero == 4) {
            return (numero - 3)
        }
        return 0;
    }

}

class Mazo {

    constructor() {
        this.cartas = []
    }

    completarMazo() {
        const palos = ['🪙', '🍷', '⚔️', '🌴']
        let mazoCompleto = []
        palos.forEach(element => {
            for (let i = 1; i <= 12; i++) {
                mazoCompleto.push(new Carta(i, element))
            }
        })
        this.cartas = mazoCompleto.filter( element => (element.numero != 8 && element.numero != 9 ))
    }

    mostrarMazo() {
        console.log(this.cartas)
    }

    mezclarCartas() {
        let mazoMezclado = new Mazo
        if (this.cartas.length > 1) {
            while (this.cartas.length > 0) {
                let i = Math.floor(Math.random() * (this.cartas.length))
                let valor = this.cartas[i]
                mazoMezclado.cartas.push(valor)
                this.cartas.splice(i, 1)
            }
        } else {
            console.log('El mazo está vacío')
        }
        return mazoMezclado
    }
}

class Jugador {

    constructor(nombre, user) {
        this.nombre = nombre
        this.cartas = []
        this.cartasEnMesa = []
        this.puntos = 0
        this.user = user
    }

    verCartas() {
        let verCartas = []
        this.cartas.forEach((elm) => {
            verCartas.push(elm.getCarta())
        })
        console.log(this.nombre + ' tus cartas son: ' + verCartas.join(' | '))
    }

    tirarCarta() {
        let ubicacion
        if (this.user) {
            ubicacion = Number(prompt(`Ingrese la Carta que quiere tirar: \n \n${this.verCartasEnPrompt(this.cartas)}`))
            while (ubicacion > this.cartas.length || ubicacion <= 0 || isNaN(ubicacion)) {
                ubicacion = Number(prompt(`No existe carta en esa ubicación. Solo tienes las siguientes cartas: \n \n${this.verCartasEnPrompt(this.cartas)}`))
            }
            ubicacion -= 1 
        } else {
            ubicacion = Math.floor((Math.random() * (this.cartas.length)))
        }
        let cartaTirada = this.cartas[ubicacion]
        this.cartas.splice(ubicacion, 1)
        cartaTirada.destapada = true
        return cartaTirada
    }

    verCartasEnPrompt(arrayCartas){
        return arrayCartas.map((elm, index) => `Carta ${(index + 1)} => ${elm.getCarta()}`).join('\n')
    }
}

class Partida {


    constructor() {
        this.user
        this.CPU = new Jugador('CPU', false)
    }

    comenzar() {
        let inicio = confirm('Bienvenido al Juego 🃏Truco🃏 ¿Comenzamos?')
        if (inicio) {
            let nombreJugador = prompt('Ingresa tu nombre')
            while(nombreJugador == null || nombreJugador == ''){
                nombreJugador = prompt('Por favor ingresa un nombre para poder mencionarte en el Juego')
            }
            this.user = new Jugador(nombreJugador, true)
            let numeroPartida = 0
            while(this.user.puntos < 10 && this.CPU.puntos < 10){
                numeroPartida += 1
                console.log(`******* Comienzo de Partida Nº ${numeroPartida} *******`)
                this.repartirCartas()
                for (let i = 0; i < 3; i++) {
                    this.user.cartasEnMesa.push(this.user.tirarCarta())
                    this.CPU.cartasEnMesa.push(this.CPU.tirarCarta())
                    console.log(`Jugada Nº ${(i+1)}: ${this.user.nombre} => ${this.user.cartasEnMesa[i].getCarta()} - ${this.CPU.cartasEnMesa[i].getCarta()} <= ${this.CPU.nombre}`)
                    if(this.user.cartasEnMesa[i].valor > this.CPU.cartasEnMesa[i].valor){
                        this.user.puntos += 1
                    } else if(this.user.cartasEnMesa[i].valor < this.CPU.cartasEnMesa[i].valor){
                        this.CPU.puntos += 1
                    } 
                }
                console.log(`Puntos: ${this.user.nombre} ${this.user.puntos} pts. | CPU: ${this.CPU.puntos} pts.
                `)
                this.user.cartasEnMesa = []
                this.CPU.cartasEnMesa = []
            }
            let fecha = new Date()
            if(this.user.puntos > this.CPU.puntos){
                console.log(`🏆FELICITACIONES ${this.user.nombre.toUpperCase()} SOS EL GANADOR🏆
Recordarás el día ${fecha.toLocaleDateString()} para siempre 😊`)
            } else if(this.user.puntos < this.CPU.puntos) {
                console.log(`❌ No se pudo, PERDISTE. La próxima será 😒 
Mejor borra la fecha ${fecha.toLocaleDateString()} de tu mente`)
            } else {
                console.log('🤷‍♂️Por lo menos no perdiste🤷‍♂️')
            }
        }
    }

    repartirCartas() {
        let naipes = new Mazo
        naipes.completarMazo()
        naipes = naipes.mezclarCartas()
        for (let i = 0; i < 3; i++) {
            let cartaUser = naipes.cartas.pop()
            let cartaCPU = naipes.cartas.pop()
            this.user.cartas.push(cartaUser)
            this.CPU.cartas.push(cartaCPU)
        }
        this.user.cartas.forEach((elm) => { elm.destaparCarta() })
        this.user.verCartas()
        this.CPU.verCartas()
    }


}

let partida = new Partida
partida.comenzar()
