let points = 1000
let wager = 0

let deck = []
let dealer = []

let hands = [[]]
let activeHand = 0

let active = false

function update(){
document.getElementById("points").innerText = "Points: " + points
}

function deckBuild(){

deck = []

let suits = ["S","H","D","C"]
let ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]

for(let s of suits){
for(let r of ranks){
deck.push({r:r,s:s})
}
}

deck.sort(()=>Math.random()-0.5)

}

function cardImage(c){
return "https://deckofcardsapi.com/static/img/" + c.r + c.s + ".png"
}

function value(c){

if(c.r==="A") return 11
if(["K","Q","J"].includes(c.r)) return 10
return parseInt(c.r)

}

function total(hand){

let t = 0
let aces = 0

for(let c of hand){
t += value(c)
if(c.r==="A") aces++
}

while(t>21 && aces>0){
t -= 10
aces--
}

return t

}

function draw(){
return deck.pop()
}

function render(){

let dealerHTML=""

if(active){

dealerHTML+="<img src='https://deckofcardsapi.com/static/img/back.png'>"
dealerHTML+="<img src='"+cardImage(dealer[1])+"'>"

document.getElementById("dealerTotal").innerText="Total: ?"

}
else{

for(let c of dealer){
dealerHTML+="<img src='"+cardImage(c)+"'>"
}

document.getElementById("dealerTotal").innerText="Total: "+total(dealer)

}

document.getElementById("dealer").innerHTML=dealerHTML

renderHands()

update()

}

function renderHands(){

let h1=""

for(let c of hands[0]){
h1+="<img src='"+cardImage(c)+"'>"
}

document.getElementById("hand1").innerHTML=h1
document.getElementById("total1").innerText="Total: "+total(hands[0])

if(hands.length>1){

let h2=""

for(let c of hands[1]){
h2+="<img src='"+cardImage(c)+"'>"
}

document.getElementById("hand2").innerHTML=h2
document.getElementById("total2").innerText="Total: "+total(hands[1])

}

}

function start(){

if(active) return

wager=parseInt(document.getElementById("bet").value)

if(wager>points){
document.getElementById("msg").innerText="Not enough points"
return
}

deckBuild()

dealer=[draw(),draw()]

hands=[[draw(),draw()]]

activeHand=0

active=true

render()

}

function hit(){

if(!active) return

hands[activeHand].push(draw())

if(total(hands[activeHand])>21){
nextHand()
}

render()

}

function nextHand(){

if(activeHand<hands.length-1){
activeHand++
}
else{
stand()
}

}

function stand(){

while(total(dealer)<17){
dealer.push(draw())
}

finish()

}

function doublePlay(){

hands[activeHand].push(draw())

nextHand()

render()

}

function split(){

let h=hands[0]

if(h.length!==2) return

if(h[0].r!==h[1].r){
document.getElementById("msg").innerText="Cannot split"
return
}

hands=[
[h[0],draw()],
[h[1],draw()]
]

activeHand=0

render()

}

function finish(){

active=false

let dealerTotal=total(dealer)

for(let h of hands){

let p=total(h)

if(p>21){
points-=wager
}
else if(dealerTotal>21||p>dealerTotal){
points+=wager
}
else if(p<dealerTotal){
points-=wager
}

}

render()

update()

}

function add(){
points+=1000
update()
}

update()
