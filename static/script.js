let blackjackHitGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};
const you = blackjackHitGame["you"];
const dealer = blackjackHitGame["dealer"];

const hitSound = new Audio("static/sounds/swish.m4a");
const winSound = new Audio("static/sounds/cash.mp3");
const loseSound = new Audio("static/sounds/aww.mp3");

document.querySelector("#hit-btn").addEventListener("click", function () {
  blackjackHit();
});
document.querySelector("#stand-btn").addEventListener("click", function () {
  dealerLogic();
});
document.querySelector("#deal-btn").addEventListener("click", function () {
  blackjackDeal();
});

function blackjackHit() {
  if (blackjackHitGame.isStand === false) {
    let card = randomCard();
    showCard(card, you);
    updateScore(card, you);
    showScore(you);
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function dealerLogic() {
  blackjackHitGame.isStand = true;
  while (dealer.score < 16 && blackjackHitGame.isStand === true) {
    let card = randomCard();
    showCard(card, dealer);
    updateScore(card, dealer);
    showScore(dealer);
    await sleep(1000);
  }

  blackjackHitGame.turnsOver = true;
  let winner = computeWinner();
  showResult(winner);
}
function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13);
  return blackjackHitGame.cards[randomNumber];
}
function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}
function blackjackDeal() {
  if (blackjackHitGame.turnsOver === true) {
    blackjackHitGame.isStand = false;
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    you.score = 0;
    dealer.score = 0;
    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#your-blackjack-result").style.color = "#fff";
    dealer.score = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").style.color = "#fff";
    document.querySelector("#blackjack-result").textContent = "Let's PLay";
    document.querySelector("#blackjack-result").style.color = "#000";
    blackjackHitGame.turnsOver = false;
  }
}
function updateScore(card, activePlayer) {
  if (card === "A") {
    if (activePlayer.score + blackjackHitGame["cardsMap"][card][1] >= 21) {
      activePlayer.score += blackjackHitGame["cardsMap"][card][1];
    } else {
      activePlayer.score += blackjackHitGame["cardsMap"][card][0];
    }
  } else {
    activePlayer.score += blackjackHitGame["cardsMap"][card];
  }
}
function showScore(activePlayer) {
  if (activePlayer.score > 21) {
    document.querySelector(activePlayer.scoreSpan).textContent = "BUST!";
    document.querySelector(activePlayer.scoreSpan).style.color = "red";
  } else {
    document.querySelector(activePlayer.scoreSpan).textContent =
      activePlayer.score;
  }
}

function computeWinner() {
  let winner;
  if (you.score <= 21) {
    if (you.score > dealer.score || dealer.score > 21) {
      winner = you;
      blackjackHitGame.wins++;
    } else if (you.score < dealer.score || you.score > 21) {
      winner = dealer;
      blackjackHitGame.losses++;
    } else if (you.score === dealer.score) {
      blackjackHitGame.draws++;
    }
  } else if (you.score > 21 && dealer.score <= 21) {
    blackjackHitGame.losses++;

    winner = dealer;
  } else if (you.score > 21 && dealer.score > 21) {
    blackjackHitGame.draws++;
  }

  return winner;
}
function showResult(winner) {
  let message, messegeColor;
  if (blackjackHitGame.turnsOver === true) {
    if (winner === you) {
      document.querySelector("#win-score").textContent = blackjackHitGame.wins;
      message = "You won";
      messegeColor = "green";
      winSound.play();
    } else if (winner === dealer) {
      document.querySelector("#lose-score").textContent =
        blackjackHitGame.losses;
      message = "You lose";
      messegeColor = "red";
      loseSound.play();
    } else {
      document.querySelector("#draw-score").textContent =
        blackjackHitGame.draws;
      message = "You draw";
      messegeColor = "yellow";
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messegeColor;
  }
}
