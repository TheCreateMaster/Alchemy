// priority: 0

// Visit the wiki for more info - https://kubejs.com/

console.info('Hello, World! (Loaded server scripts)')

function OffsetAxis (coords, offset, axis, reverse) {
    const {x, y , z} = {x:coords[0], y:coords[1], z:coords[2]}
    const axes = ["up", "down", "north", "south", "east", "west"]
    const revAxis = {"up":"down", "down":"up", "north":"south", "south":"north", "east":"west", "west":"east"}
    
    const offAxis = {
        "up":[x, y + offset, z],
        "down":[x, y - offset, z],
        "north":[x, y, z - offset],
        "south":[x, y, z + offset],
        "east":[x + offset, y, z],
        "west":[x - offset, y, z]
    }
    
    if (axis != false && axes.includes(axis)) {
        if (reverse === true) {
            axis = revAxis[axis]
        }
        return offAxis[axis]
    }

    if (reverse === true) {
        let temp = []
        for (const [key, value] of Object.entries(offAxis)) {
            key = revAxis[key]
            temp[key] = value
        }
        return temp
    }

    return offAxis
}

BlockEvents.leftClicked('minecraft:crafting_table', event => {
    
    if (!event.player.getClass().getName().contains("DeployerFakePlayer")) {
        return
    }

    const block = event.block
    const {bx, by , bz} = {bx:block.x, by:block.y, bz:block.z}

    let level = event.server.getLevel("minecraft:overworld")

    let pointer = false

    for (const [key, value] of Object.entries(OffsetAxis([bx, by, bz], 1, false , false))) {
        if (key == "up") {
            continue
        }
        let tempPointer = level.getBlock(value);
        event.server.tell(tempPointer.id)
        if (tempPointer.id == "minecraft:lightning_rod") {
            pointer = tempPointer
            break
        }
    }

    event.server.tell(pointer)


    let entities = level.getEntitiesWithin(AABB.of(bx-2,by-2,bz-2,bx+2,by+2,bz+2))
})

// BlockEvents.rightClicked('minecraft:crafting_table', event => {
//     let x = event.block.x;  // Get the X coordinate of the block clicked
//     let y = event.block.y;  // Get the Y coordinate of the block clicked
//     let z = event.block.z;  // Get the Z coordinate of the block clicked

//     console.info(`Checking for mobs at coordinates: x=${x}, y=${y}, z=${z}`);

//     // Get entities at the coordinates above the block clicked (y = by + 1)
//     let entities = event.server.getLevel("minecraft:overworld").getEntitiesWithin(AABB.of(x-2,y-2,z-2,x+2,y+2,z+2))

//     // Filter for mobs (e.g., zombies, etc.)
//     let mobs = entities.filter(entity => entity.type.startsWith('minecraft:'));

//     // Check if any mobs were found at the given coordinates
//     if (mobs.length > 0) {
//         mobs.forEach(mob => {
//             console.info(`Found mob: ${mob.type} at x=${x}, y=${y}, z=${z}`);
//             // Accessing additional mob data
//             console.info(`Mob ID: ${mob.id}`);
//             console.info(`Mob UUID: ${mob.uuid}`);
//             // You can access other properties as needed
//         });
//     } else {
//         console.info(`No mobs found at x=${x}, y=${y}, z=${z}`);
//     }
// })

