const car = "2026-03-03 08:18:59 [INFO]: [550e8400-e29b-41d4-a716-446655440000]"

let uuid = car.slice(29, 29+36)
console.log(uuid)