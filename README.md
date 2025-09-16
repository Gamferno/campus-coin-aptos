# CampusCoin 🎓💰

CampusCoin is a **Move smart contract** built on the Aptos blockchain.  
It implements a managed fungible asset (token) designed specifically for **college campuses**.  

The main idea:  
- **College admins** can mint and distribute CampusCoins to students as incentives (e.g., for attendance, participation, or achievements).  
- **Students** can spend these tokens with approved campus vendors (canteens, stationery shops, etc.).  
- **Admins** retain full control, including minting, burning, freezing/unfreezing accounts, and managing transfers.

---

## ✨ Features

- **Custom Token**  
  - Name: `Campus Coin`  
  - Symbol: `CC`  
  - Decimals: `8`  

- **Admin Controls**
  - Mint new tokens and deposit to student wallets.  
  - Transfer tokens between accounts.  
  - Burn tokens from any account.  
  - Freeze/unfreeze student/vendor accounts.  

- **Student/Vendor Usage**
  - Students receive CampusCoins from admins.  
  - Vendors can accept CampusCoins as payment within the campus.  
  - Coins can be transferred among accounts (if not frozen).  

---

## 📜 Functions Overview

- `init_module(admin)` → Initializes the token metadata.  
- `mint(admin, to, amount)` → Mint new CampusCoins to a student or vendor.  
- `transfer(admin, from, to, amount)` → Move coins between accounts.  
- `burn(admin, from, amount)` → Burn tokens from an account.  
- `freeze_account(admin, account)` / `unfreeze_account(admin, account)` → Restrict or allow transfers.  
- `get_metadata()` / `get_name()` → View token details.  

---

## 🛠 How It Works

1. **Deploy the module** → The deployer (college admin) automatically creates the CampusCoin asset.  
2. **Minting** → Admin mints coins into student wallets.  
3. **Spending** → Students pay vendors in CampusCoins.  
4. **Admin Controls** → Admin can freeze/unfreeze accounts or burn tokens when necessary.  

---

## 🚀 Example Use Case

1. College admin deploys `CampusCoin::fa_coin`.  
2. A student receives `100 CC` as a reward for good performance.  
3. The student spends `20 CC` at the canteen.  
4. The admin burns unused tokens at the end of the semester.  

---

## 📦 Testing

The module includes built-in Move tests:  
- `test_basic_flow` → Covers initialization, minting, freezing, transferring, unfreezing, and burning.  
- `test_permission_denied` → Ensures only the admin can mint CampusCoins.  

Run tests with:
```bash
aptos move test

## Transaction Hash

