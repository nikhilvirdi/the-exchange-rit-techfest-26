import marioMinecraft from '../assets/problem-statements/mario-minecraft.png'
import spaceInvadersBreakout from '../assets/problem-statements/space-invaders-breakout.png'
import pacmanBomberman from '../assets/problem-statements/pacman-bomberman.png'
import sokobanPortal from '../assets/problem-statements/sokoban-portal.png'
import pokemonSnake from '../assets/problem-statements/pokemon-snake.png'

function illustration(src, alt) {
  return src ? { src, alt } : undefined
}

export const problemTracks = [
  {
    "title": "Track I: Remix the Classic",
    "description": "Take games everyone knows and give them a completely unexpected twist. Mix familiar gameplay with mechanics from another game to create something new, fun, and challenging.",
    "statements": [
      {
        "title": "Mario x Minecraft",
        "illustration": illustration(marioMinecraft, "Mario jumps between brick platforms while a zombie approaches and a skeleton fires an arrow past a Creeper."),
        "description": "Imagine playing Super Mario, but instead of Goombas and Koopas, you're fighting Minecraft mobs! Build a 2D platformer where the player runs, jumps across platforms, and avoids obstacles to reach the flag at the end of the level. The twist is that the enemies are Minecraft creatures with their own behaviors. Creepers approach the player and explode when they get close, zombies chase the player, and skeletons shoot arrows from a distance. The player must survive these enemies, navigate the level, and reach the finish line. Make sure each enemy behaves differently so players have to think about how to avoid or defeat them."
      },
      {
        "title": "Space Invaders x Breakout",
        "illustration": illustration(spaceInvadersBreakout, "A ball rebounds toward colorful rows of space invaders as their shots descend toward a paddle."),
        "description": "Imagine defending Earth from aliens, but someone took away your spaceship's guns and gave you a bouncing ball instead. Combine Space Invaders with the classic Breakout game. Players control a paddle at the bottom of the screen and use it to bounce a ball toward rows of invading aliens. The ball destroys aliens whenever it hits them, but the aliens don't just sit there. They gradually move downward and shoot projectiles toward the player. Players must keep the ball bouncing, aim it toward enemies, dodge incoming attacks, and destroy the alien invasion before it reaches the bottom of the screen."
      },
      {
        "title": "Pac-Man x Bomberman",
        "illustration": illustration(pacmanBomberman, "Pac-Man sits beside a bomb in a blue maze as a cross-shaped explosion reaches a ghost."),
        "description": "What if Pac-Man could fight ghosts using bombs? Build a Pac-Man-style maze where the player moves through corridors, collects pellets, and avoids ghosts. But instead of only running away, the player can place bombs just like in Bomberman. Each bomb explodes after a short countdown and can destroy nearby ghosts or break certain walls in the maze. However, the explosions are dangerous to everyone, including the player! The challenge is to collect all the pellets while using bombs strategically to clear paths and escape enemies. Players need to time their explosions carefully so they don't accidentally trap or blow themselves up."
      },
      {
        "title": "Sokoban x Portal",
        "illustration": illustration(sokobanPortal, "A player pushes a crate into a blue portal as a crate emerges from an orange portal in another room."),
        "description": "What happens when a classic box-pushing puzzle gets Portal-style teleportation? Build a small puzzle game where players must push boxes onto specific target tiles to complete each level. The player can move around the map and push boxes, but cannot pull them backward. Now add pairs of connected portals! Whenever a player or box enters one portal, it instantly appears at the other. Players must figure out how to use these portals to move boxes into the correct positions. Be careful, though. A wrong push could send a box into a corner, block a portal, or make the puzzle impossible to complete. The goal is to place every box on its target using clever movement and teleportation."
      },
      {
        "title": "Pokemon Snake",
        "illustration": illustration(pokemonSnake, "A fire-type snake winds across a checkerboard toward a leaf, with water drops and flames on nearby tiles."),
        "description": "What if the classic Snake game followed Pokémon battle rules? Build a Snake game where the food isn't just something you eat to grow. Instead, every food item has an elemental type, such as Fire, Water, or Grass. Your snake also has an elemental type, and the familiar Pokémon-style type advantages decide what happens when you eat something. For example, a Fire-type snake grows when it eats Grass-type food but gets punished for eating Water-type food. Eating the wrong type might shrink your snake or even end the game. Players must survive, avoid crashing into walls or their own bodies, and choose the right food to grow as much as possible."
      }
    ]
  },
  {
    "title": "Track II: Learning / Adaptive Behavior",
    "description": "Build games and virtual creatures that remember what you do and change how they behave. They don't need actual machine learning. Simple memory, patterns, and decision-making rules are enough.",
    "statements": [
      {
        "title": "The Judgmental Tamagotchi",
        "description": "Most virtual pets become happy again as soon as you feed them. This one remembers everything. Build a virtual pet that players can feed, entertain, clean, and interact with. The pet should have basic needs, such as hunger, happiness, and energy, but it should also remember how the player has treated it over time. If the player repeatedly ignores it, overfeeds it, or neglects its needs, the pet might become grumpy, stubborn, or less trusting. Even after being fed, it shouldn't instantly forget how it was treated. For example, a neglected pet might refuse to play immediately, while a well-cared-for pet might become more affectionate and responsive. Create different moods, expressions, and reactions that change based on both the pet's current needs and its past experiences."
      },
      {
        "title": "The Haunted Algorithm",
        "description": "What if the ghosts in Pac-Man stopped blindly chasing you and started learning how you play? Build a Pac-Man-style maze where the player collects pellets while avoiding ghosts. At first, the ghosts can follow simple movement or chasing rules. But as the player moves around the maze, the ghosts begin remembering which paths they use most often, where they usually turn, and which routes they prefer when escaping. Over time, the ghosts should use this information to predict the player's next move and try to block their usual escape routes. For example, if a player repeatedly escapes through the same corridor, a ghost might start waiting near its exit instead of chasing from behind. The challenge is to create enemies that visibly adapt to the player's habits, forcing them to change their strategy. This behavior can be implemented using movement history and simple prediction rules without training a machine learning model."
      },
      {
        "title": "Desk Gremlin",
        "description": "Build a tiny animated creature that lives on your screen and acts like a little digital companion. The pet should have different animations for actions such as walking, sleeping, eating, sitting idle, and reacting to the user. Use a spritesheet, which is a collection of animation frames stored in a single image, to bring the character to life. Players should be able to interact with the pet by clicking it, feeding it, or playing with it. The pet should also behave on its own. For example, after being left alone for some time, it might start wandering around, sit down, or fall asleep. The main challenge is to make the character feel alive through smooth animations, natural transitions, and simple behavior rules. You don't need to train an AI model. The pet's actions can be controlled entirely through timers, interactions, and internal states."
      },
      {
        "title": "Maze of Bad Habits",
        "description": "Usually, players learn how to navigate a maze. But what if the maze started learning how the player navigates? Build a maze game where the player explores different paths, collects keys, and tries to reach the exit. As the player moves, the maze remembers which corridors they visit most often and which routes they seem to prefer. Every time the player collects a key, parts of the maze rearrange themselves to make those familiar routes less useful. For example, if the player keeps taking the same shortcut, the maze might block that corridor and open a different route. The maze should never become completely impossible to solve. There must always be a valid path to continue the game after every rearrangement. The objective is to escape an environment that constantly changes based on the player's own decisions."
      },
      {
        "title": "The Petty Sorcerer",
        "description": "You're a wizard fighting another wizard, but your opponent is getting better at predicting your spells. Build a turn-based battle game where the player fights an enemy wizard using different elemental spells, such as Fire, Ice, and Lightning. Each spell should have its own effects or damage values. The enemy starts with normal defenses but gradually adapts to the player's fighting style. For example, if the player keeps attacking with Fire spells, the enemy starts developing Fire resistance, making those attacks increasingly less effective. If the player switches to Lightning, the enemy must gradually adjust to that instead. Players need to experiment with different spells and change their strategies instead of repeating the same powerful attack. The goal is to defeat an opponent that remembers your favorite moves and adapts its defenses accordingly."
      }
    ]
  },
  {
    "title": "Track III: Tiny Languages & Playgrounds",
    "description": "Create your own miniature programming languages, virtual computers, and experimental coding playgrounds. The goal is to make something people can program, execute, and interact with, without needing complex tools or infrastructure.",
    "statements": [
      {
        "title": "The Emoji Interpreter",
        "description": "What if you could write an entire computer program using only emojis? Create your own tiny programming language with exactly 12 emoji-based instructions. Each emoji represents a programming operation, such as storing a number, adding values, comparing numbers, jumping to another instruction, or printing output. For example, one emoji might push a number onto a stack (a list where the last item added is the first one removed), while another emoji might add the top two numbers together. Users should be able to type programs using these emojis and execute them in a simple editor. The interesting part is the debugger. Include a way to run the program one instruction at a time while showing which emoji is currently executing, what values are stored in the stack, and what output has been produced. The playground should also handle mistakes, such as unknown instructions, trying to use values that don't exist, or programs that keep running forever."
      },
      {
        "title": "Pixels on Command",
        "description": "What if you could draw pictures by writing simple commands instead of using a mouse? Build a tiny programming language that controls a drawing cursor on a pixel canvas. Users should be able to write commands such as `MOVE`, `TURN`, `PAINT`, `COLOR`, and `REPEAT` to create drawings. For example, a program could tell the cursor to move five pixels to the right, turn downward, change its color to red, and repeat those steps to draw a pattern. By combining simple instructions, users should be able to create shapes, colorful pixel art, and interesting geometric designs. The playground should visually show the cursor following the instructions and drawing on the canvas. Include controls to run, pause, and reset a program so users can watch how their code creates the final artwork."
      },
      {
        "title": "8-Bit Brain",
        "description": "Ever wondered what happens inside a computer when it runs a program? Build a tiny computer of your own! Create a simulator of a simplified 8-bit CPU. It should have four small registers for temporarily storing numbers, 16 memory locations for storing data, and a limited set of instructions. Users should be able to write simple assembly-like programs that tell the CPU what to do. For example, instructions might load a number into a register, add two numbers, store a result in memory, or jump to another instruction. When a program runs, the simulator should show how the values in registers and memory change after each instruction. Include a step-by-step execution mode so users can see exactly what the CPU is doing at any moment. Since this is an 8-bit computer, numbers are limited to a small range, so the simulator must also demonstrate what happens when calculations exceed that limit. The goal is to build a working miniature computer that makes the process of executing instructions easy to understand and explore."
      },
      {
        "title": "Compile Me Maybe",
        "description": "Invent your own programming language and build something that can actually run it! Create a tiny language with your own keywords and syntax. It should support basic programming operations, such as creating variables, performing calculations, and printing messages. For example, instead of writing `let x = 10` or `console.log(x)`, users might write something completely different that your invented language understands. Build a compiler that takes this custom code and converts it into JavaScript. The playground should show the original code on one side and the generated JavaScript on the other. Users should also be able to execute the program and see its output. To make the process more interesting, show how the compiler breaks the code into smaller pieces called tokens, understands the structure of those tokens, and turns them into valid JavaScript. If users make mistakes in their code, the compiler should explain what went wrong rather than simply crashing."
      },
      {
        "title": "Shader Sorcery",
        "description": "What if a few mathematical formulas could create beautiful moving patterns on your screen? Build a visual playground where users can generate colorful artwork using simple mathematical expressions. Users should be able to write formulas containing variables such as `x`, `y`, and `time`, along with operations like addition, multiplication, `sin`, and `cos`. The program uses these formulas to decide what colors or patterns appear at different points on a canvas. For example, changing a simple `sin` expression could create moving waves, ripples, or colorful repeating patterns. Including `time` in the formula can make the artwork move automatically. Whenever the user changes a formula, the visual output should update so they can immediately see what effect their changes have. Include a few example formulas, adjustable values, and controls for animation. Invalid expressions should produce a helpful error instead of breaking the playground. The goal is to create a fun space where users can experiment with code and mathematics to produce interactive, animated digital art."
      }
    ]
  },
  {
    "title": "Track IV: Living Worlds & Simulations",
    "description": "Build worlds that generate, grow, and evolve on their own.",
    "statements": [
      {
        "title": "Sandbox Gone Wild",
        "description": "What happens when you mix sand, water, fire, and plants in a world where everything follows its own rules? Build an interactive sandbox where users can draw different materials onto a canvas and watch them interact. Sand falls downward and piles up, water flows around obstacles and fills empty spaces, fire spreads to nearby plants, and plants grow when they have access to water. Users should be able to select materials, draw or erase them, and create their own little experiments. For example, pouring water onto a pile of sand might make it flow around the pile, while lighting a group of plants on fire could start a chain reaction. The challenge is to make each material behave naturally and interact correctly with the others, creating a world that keeps changing even when the user stops drawing."
      },
      {
        "title": "Jarassic Park",
        "description": "Can you create a tiny ecosystem that survives on its own, or will everything eventually die? Build a small simulation containing grass, herbivores, and predators living together in a shared environment. Grass grows naturally, herbivores move around eating grass, and predators hunt herbivores for food. Every creature needs energy to survive, and animals can reproduce when they have enough food. Users should be able to adjust settings such as the starting populations, grass growth rate, and reproduction speed using sliders or controls. For example, adding too many predators might wipe out the herbivores, leaving the predators without food. Too many herbivores might consume all the grass and starve. The goal is to create a living ecosystem where populations constantly change, and players can experiment to discover what keeps the environment balanced."
      },
      {
        "title": "The Neverending Dungeon",
        "description": "What if every time you entered a dungeon, you discovered a completely different world? Build a small dungeon generator that automatically creates new maps filled with rooms, corridors, walls, and obstacles. Each dungeon should have a starting position, an exit, and a valid path connecting them. Players should be able to explore the generated dungeon, navigate through its rooms, and find their way to the exit. The interesting part is that every dungeon is generated using a seed, which is a number or text value that controls the map generation. Using the same seed should always produce the same dungeon, allowing players to share their favorite maps with friends. Add a way to generate random dungeons, enter custom seeds, and explore the resulting layouts. The challenge is to make the maps varied and interesting while ensuring that every generated dungeon remains playable."
      },
      {
        "title": "Darwin's Playground",
        "description": "What if you could create a world where tiny creatures evolve without anyone directly controlling them? Build a simulation where a population of simple creatures moves around an environment searching for food and trying to survive. Each creature has traits such as movement speed, body size, and vision range, which affect how it behaves. For example, a faster creature might reach food before others, while one with better vision could detect food from farther away. Creatures lose energy as they move, gain energy by eating, and can reproduce when they have enough energy. Their offspring inherit similar traits, but small random mutations can make them slightly faster, larger, or better at seeing. Users should be able to change environmental conditions, such as food availability, and observe how the population changes over generations. The goal is to demonstrate how different traits become more or less common depending on which creatures survive and reproduce."
      },
      {
        "title": "Tiny Terra",
        "description": "Ever wanted to create your own little planet and watch it come to life? Build a planet generator that creates miniature worlds with different landscapes, environments, and weather conditions. Each planet should contain features such as oceans, mountains, forests, deserts, and snowy regions, with the placement of these features determined by the planet's generation rules. Users should be able to generate new planets using random seeds and explore the resulting world through a 2D map or a simple rotating globe. Add a day-and-night cycle where sunlight moves across the planet, changing which regions are illuminated. Users can experiment with settings such as temperature, water levels, and terrain variation to see how different kinds of planets are formed. For example, a hot planet might contain large deserts, while a colder planet might have widespread snow and ice. The goal is to create a miniature world generator where every planet feels different, and users can explore how changing a few conditions transforms an entire world."
      }
    ]
  }
]
