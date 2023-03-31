// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProductTracking{


    //Test section
    string public test_variable = "This is a test variable";

    function test_function() public pure returns (string memory){
            return "Hello World is the content of this test function";
    }  
    //Test section ends



    struct Product{
        uint256 id;
        string name;
        uint256 price;
        uint256 manufacturer_id;
        uint256[] dealers_passed;
    }

    mapping (uint256 => Product) public products;
    uint256 total_products = 0;
    

    function add_product(uint256 _id, string memory _name, uint256 _price, uint256 _manufacturer_id) public returns (uint256)
    {

        uint256[] memory temp;
        
        Product memory new_product = Product(_id, _name, _price, _manufacturer_id, temp);      
        products[_id] = new_product;

        total_products++;

        return 1;
    }

    function add_dealer(uint256 product_id, uint256 dealer_id, uint256 manufacturer_id) public returns(uint)
    {
        
        if(products[product_id].manufacturer_id == manufacturer_id)
        {
            products[product_id].dealers_passed.push(dealer_id);
            return 1;
        }
        else
        {
            return 0;
        }
        
    }

    function get_product_info(uint256 _id) public view returns(Product memory){

        if(_id <= total_products)
        {
            Product memory product = products[_id];
            return product;
        }
        else
        {
            Product memory temp;
            return temp;
        }
    }


    
}