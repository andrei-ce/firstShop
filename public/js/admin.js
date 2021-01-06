const deleteProduct = async (btn) => {
  try {
    let prodId = btn.parentNode.querySelector('input[name=productId]').value;
    let csrf = btn.parentNode.querySelector('input[name=_csrf]').value;
    console.log(prodId);
    console.log(csrf);
    //fetch is a method available in browsers (delete on backend)
    let result = await fetch('/admin/delete-product/' + prodId, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf,
      },
    });

    //delete on frontent (DOM manipulation)
    let productEl = btn.closest('article');
    // productEl.remove() --> not supoprted by IE
    productEl.parentNode.removeChild(productEl);

    //return fetch result in json format
    return result.json();
  } catch (error) {
    console.log(error);
  }
};
