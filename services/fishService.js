class Fish {
  msg;
  cmt;
  value;
  price;
  constructor(roll) {
    if (roll < -5) {
      this.msg = "You caught a :motorized_wheelchair:!";
      this.cmt = "2fast2furious";
      this.value = "motorized_wheelchair";
      this.price = 100;
    } else if (roll < 0) {
      this.msg = "You caught a :manual_wheelchair:!";
      this.cmt = ":fire:";
      this.value = "manual_wheelchair";
      this.price = 50;
    } else if (roll < 10) {
      this.msg = "You caught my :heart:!";
      this.cmt = ":flushed:";
      this.value = "heart";
      this.price = 25;
    } else if (roll < 25) {
      this.msg = "You caught nothing!";
      this.cmt = "Unlucky";
    } else if (roll >= 100) {
      this.msg = "You caught a :blowfish:!";
      this.cmt = "INSANE!";
      this.value = "blowfish";
      this.price = 50;
    } else if (roll >= 90) {
      this.msg = "You caught a :tropical_fish:!";
      this.cmt = "Pog!";
      this.value = "tropical_fish";
      this.price = 25;
    } else if (roll >= 75) {
      this.msg = "You caught a :fish:!";
      this.cmt = "nice";
      this.value = "fish";
      this.price = 10;
    } else if (roll >= 50) {
      this.msg = "You caught a :boot:!";
      this.cmt = "It's brand new";
      this.value = "boot";
      this.price = 1;
    } else if (roll >= 25) {
      this.msg = "You caught a :wrench:!";
      this.cmt = "Maybe someone else can use it";
      this.value = "wrench";
      this.price = 1;
    }
  }
}

class Item {
  id;
  price;
  name;
  flvr1;
  flvr2;
  flvrshop;
  userp;
  constructor(id) {
    if (id == 1) {
      this.id = 1500;
      this.price = 5;
      this.name = "Nanotube fishing line";
      this.flvr1 = "Good luck breaking that one";
      this.flvr2 = "You wouldnt want to buy this twice";
      this.flvrshop = "+5 Base roll";
      this.userp = "line";
    } else if (id == 2) {
      this.id = 2;
      this.price = 500;
      this.name = "Lucky bait";
      this.flvr1 = "Luck of the sea";
      this.flvr2 = "Trying to double your luck eh?";
      this.flvrshop = "Slightly luckier rolls";
      this.userp = "bait";
    } else if (id == 3) {
      this.id = 3;
      this.price = 10000;
      this.name = "Reinforced boat";
      this.flvr1 = "Surely the sharks cant get you now";
      this.flvr2 = "We get it, you're rich";
      this.flvrshop = "Your boat cant break";
      this.userp = "boat";
    } else {
      this.id = -1;
    }
  }
}
function getAllItems() {
  let allItems = [];
  let id = 1;
  do {
    let item = new Item(id);
    if (item.id != -1) {
      allItems.push(item);
      id++;
    } else {
      id = -1;
    }
  } while (id != -1);
  return allItems;
}

function getValueOfInv(user) {
  let value =
    user.fish * new Fish(76).price +
    user.motorized_wheelchair * new Fish(-6).price +
    user.manual_wheelchair * new Fish(-1).price +
    user.heart * new Fish(9).price +
    user.blowfish * new Fish(101).price +
    user.tropical_fish * new Fish(91).price +
    user.boot * new Fish(51).price +
    user.wrench * new Fish(26).price;
  return value;
}

module.exports = {
  Fish,
  Item,
  getValueOfInv,
  getAllItems,
};
