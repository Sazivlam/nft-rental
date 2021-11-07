export const getUsername = async (smart_contract_interface, address) => {
  let username = await smart_contract_interface.methods
    .users(address)
    .call()
    .then((username) => {
      // console.log("dataa", data);
      return username;
    })
    .catch((error) => {
      console.log(error);
    });

  if (username === "") {
    username =
      address.slice(0, 4) +
      "..." +
      address.slice(address.length - 2, address.length);
  }
  return username;
};
