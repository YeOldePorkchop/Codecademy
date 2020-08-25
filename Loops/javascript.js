let amountNeeded = 5;
let amountCompleted = 0;

for (let i = 0; i < 5; i++) {
  console.log("For Loop: " + i);
}

do {
  console.log("Do While Loop: " + amountCompleted);
  amountCompleted++;
  // Test
} while (amountCompleted < amountNeeded);