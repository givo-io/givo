/*jshint esversion: 8 */
// Ringeby Deployed contract address: 0x1cfC19Ff4A875CEFA55095eC3840Ba7683c1fe7c
// default Account: 0x08427F4196800c59c925cb1D0c1BcfcB759f13C6

App = {
  account: '',
  address: '0x70561d1ea945298fb9b12575d277c77c97eec5e9',
  contract: '',
  options: {
    from: this.account
  },

  init: function(run) {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      console.log("Metamask Unavailable");
      web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(web3Provider);
    }
    ethereum.enable();
    return App.init_contract(run);
  },

  get_balance: function() {
    web3.eth.getBalance(App.account, (err, wei) => {
      var eth = web3._extend.utils.fromWei(wei, 'ether');
      console.log(eth);
    });
  },

  init_contract: function(run) {
    $.getJSON( "../build/contracts/givo.json", function( jsonInterface ) {
      //console.log(jsonInterface);
      App.contract = web3.eth.contract(jsonInterface.abi).at(App.address);
      App.account = web3.eth.defaultAccount;
      App.options.from = web3.eth.defaultAccount;
      //console.log(App.contract);
      run();
    });
  },

 get_id: async function() {
    if(Storage.my_id() == 0) {
      await promisify(cb => App.contract.assign_id(App.options, cb));
      id = await promisify(cb => App.contract.address_to_id(App.account, App.options, cb));
      try {
        console.log("Id Assigned:"+id);
        Storage.set_id(id);
        return id;
      } catch(error) {
        console.log("Error Assigning Id");
      }
    }else {
      return Storage.my_id();
    }
  },

  get_offer_details: async function(product_id) {
    offer_details = await promisify(cb => App.contract.all_goods(product_id, App.options, cb));
    return [offer_details[3], offer_details[4], offer_details[5]];
  }

};
