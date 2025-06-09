import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 101101,
    name: "Jack",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Brian",
    balance: -7,
    gender: "male",
  },
  {
    id: 202202,
    name: "Tom",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
    balance: 20,
    gender: "male",
  },
  {
    id: 303303,
    name: "Ryan",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=clark",
    balance: 0,
    gender: "male",
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddF, setShowAddF] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddF(false);
  }

  function handleAdd() {
    setShowAddF(!showAddF);
  }

  function handleSelect(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddF(false);
  }
  function handleSplitBillValue(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <>
      <div className="logo-wrapper">
        <img src="/logo.svg" alt="Fai₹Share logo" className="logo-img" />
        <h1 className="logo">Fai₹Share</h1>
      </div>

      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            onSelection={handleSelect}
            selectedFriend={selectedFriend}
          />
          {showAddF && <FormAddFriend onAddFriend={handleAddFriend} />}
          <Button onClick={handleAdd}>
            {showAddF ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBillValue}
            key={selectedFriend.id}
          />
        )}
      </div>
    </>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}₹
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}₹
        </p>
      )}
      {friend.balance === 0 && (
        <p className="red">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const genderOptions = ["male", "female"];

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;

    const id = crypto.randomUUID();
    const avatarStyle = gender === "male" ? "adventurer" : "avataaars";
    const newFriend = {
      id,
      name,
      gender,
      image: `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setGender("male");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Gender</label>
        <div className="gender-options">
          {genderOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="gender"
                value={option}
                checked={gender === option}
                onChange={() => setGender(option)}
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, SetPaidBill] = useState("");
  const [payer, setPayer] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(payer === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          SetPaidBill(Number(e.target.value)) > bill
            ? paidByUser
            : Number(e.target.value)
        }
      />

      <label>{selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is paying the bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
