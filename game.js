let startingPoints=1000
let points=1000
let wager=0

let rounds=0
let wins=0
let losses=0
let reshuffles=0

let deck=[]
let dealer=[]

let hands=[[]]
let activeHand=0

let active=false

function update(){

document.getElementById("points").innerText="Points: "+points

document.getElementById("rounds").innerText=rounds
document.getElementById("wins").innerText=wins
document.getElementById("losses").innerText=losses
document.getElementById("reshuffles").innerText=reshuffles
document.getElementById("profit").innerText=points-startingPoints

}

function deckBuild(){

deck=[]

let suits=["S","H","D","C"]
let ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"]

for(let s of suits){
for(let r of ranks){
deck.push({r:r,s:s})
}
}

deck.sort(()=>Math.random()-0.5)

reshuffles++

}

function autoShuffle(){

if(deck.length<15){
deckBuild()
}

}

function cardImage(c){
return "https://deckofcardsapi.com/static/img/"+c.r+c.s+".png"
}

function value(c){

if(c.r==="A") return 11
if(["K","Q","J"].includes(c.r)) return 10
return parseInt(c.r)

}

function total(hand){

let t=0
let aces=0

for(let c of hand){
t+=value(c)
if(c.r==="A") aces++
}

while(t>21 && aces>0){
t-=10
aces--
}

return t

}

function draw(){
autoShuffle()
return deck.pop()
}

function render(){

renderDealer()
renderHands()

update()

}

function renderDealer(){

let html=""

if(active){

html+="<img src='https://deckofcardsapi.com/static/img/back.png'>"
html+="<img src='"+cardImage(dealer[1])+"'>"

document.getElementById("dealerTotal").innerText="Total: ?"

}else{

for(let c of dealer){
html+="<img src='"+cardImage(c)+"'>"
}

document.getElementById("dealerTotal").innerText="Total: "+total(dealer)

}

document.getElementById("dealer").innerHTML=html

}

function renderHands(){

let h1=""
for(let c of hands[0]){
h1+="<img src='"+cardImage(c)+"'>"
}

let hand1=document.getElementById("hand1")

hand1.innerHTML=h1
document.getElementById("total1").innerText="Total: "+total(hands[0])

hand1.classList.remove("active-hand")

if(activeHand===0 && active){
hand1.classList.add("active-hand")
}

if(hands.length>1){

let h2=""
for(let c of hands[1]){
h2+="<img src='"+cardImage(c)+"'>"
}

let hand2=document.getElementById("hand2")

hand2.innerHTML=h2
document.getElementById("total2").innerText="Total: "+total(hands[1])

hand2.classList.remove("active-hand")

if(activeHand===1 && active){
hand2.classList.add("active-hand")
}

}

}

function start(){

if(active) return

wager=parseInt(document.getElementById("bet").value)

if(wager>points){
document.getElementById("msg").innerText="Not enough points"
return
}

dealer=[draw(),draw()]
hands=[[draw(),draw()]]

activeHand=0
active=true

rounds++

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
}else{
stand()
}

}

function stand(){

setTimeout(()=>{
while(total(dealer)<17){
dealer.push(draw())
}
finish()
},600)

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

function showFloat(text,color){

let m=document.getElementById("msg")

m.innerHTML="<span class='float' style='color:"+color+"'>"+text+"</span>"

}

function finish(){

active=false

let dealerTotal=total(dealer)

for(let h of hands){

let p=total(h)

if(p>21){
points-=wager
losses++
showFloat("-"+wager,"red")
}
else if(dealerTotal>21||p>dealerTotal){
points+=wager
wins++
showFloat("+"+wager,"lightgreen")
}
else if(p<dealerTotal){
points-=wager
losses++
showFloat("-"+wager,"red")
}
else{
showFloat("Push","white")
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
