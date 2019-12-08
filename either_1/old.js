// const Either = Left || Right
const Right = x => 
({
    map: f => Right(f(x)),
    fold: (f, g) => g(x)
})

const Left = x => 
({
    map: f => Left(x),
    fold: (f, g) => f(x)
})

const findColor = name => 
    ({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'})[name]

const firstResult = Right(3).map(x => x + 1).map(x => x / 2).fold(x => 'error', x => x)
const secondResult = Left(3).map(x => x + 1).map(x => x / 2).fold(x => 'error', x => x)

const colorResult = findColor('red').slice(1).toUpperCase()

console.log(firstResult)
console.log(secondResult)
console.log(colorResult)