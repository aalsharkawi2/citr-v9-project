import { useEffect, useState } from "react";
import Pizza from "./Pizza";

// Currency formatter
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pizza data on mount
  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated delay
    const pizzasRes = await fetch("/api/pizzas");
    const pizzasJson = await pizzasRes.json();
    setPizzaTypes(pizzasJson);
    setLoading(false);
  }

  let selectedPizza, price;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(
      selectedPizza?.sizes ? selectedPizza.sizes[pizzaSize] : ""
    );
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form>
        <div>
          <div>
            <label htmlFor="pizza-type">Pizza Type</label>
            <select
              onChange={(e) => setPizzaType(e.target.value)}
              name="pizza-type"
              value={pizzaType}
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label htmlFor="pizza-size">Pizza Size</label>
            <div>
              {["S", "M", "L"].map((size) => (
                <span key={size}>
                  <input
                    checked={pizzaSize === size}
                    onChange={(e) => setPizzaSize(e.target.value)}
                    type="radio"
                    name="pizza-size"
                    value={size}
                    id={`pizza-${size.toLowerCase()}`}
                  />
                  <label htmlFor={`pizza-${size.toLowerCase()}`}>
                    {size === "S" ? "Small" : size === "M" ? "Medium" : "Large"}
                  </label>
                </span>
              ))}
            </div>
          </div>

          <button type="submit">Add to Cart</button>
        </div>

        {!loading && selectedPizza && (
          <div className="order-pizza">
            <Pizza
              name={selectedPizza.name}
              description={selectedPizza.description}
              image={selectedPizza.image}
            />
            <p>{price}</p>
          </div>
        )}
      </form>
    </div>
  );
}