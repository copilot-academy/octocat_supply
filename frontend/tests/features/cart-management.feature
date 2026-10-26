Feature: Shopping cart management
  As a supply chain planner
  I want to review and manage items in my cart
  So that I can confirm quantities and costs before checkout

  Scenario: Browse products from an empty cart
    Given my shopping cart is empty
    When I choose to browse products
    Then I am taken to the product catalog

  Scenario: Review cart items and order totals
    Given my cart contains multiple products
    When I open my shopping cart
    Then I see each product and its quantity
    And I see the correct subtotal and total
    And the cart indicator shows the total number of units

  Scenario: Change a product quantity with the keyboard
    Given my cart contains a product
    When I increase its quantity using the keyboard
    Then its line total and order total are updated
    And I cannot decrease its quantity below one

  Scenario: Remove an individual product
    Given my cart contains multiple products
    When I remove one product
    Then the other products remain in my cart
    And the order total reflects the remaining products

  Scenario: Clear the entire cart
    Given my cart contains products
    When I clear the entire cart
    Then I see the empty cart message

  Scenario: Continue shopping from a populated cart
    Given my cart contains a product
    When I choose to continue shopping
    Then I am taken to the product catalog
