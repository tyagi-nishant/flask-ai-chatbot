# Setting up project in Visual Studio Code

## 1. Prerequisites

### 1.1 Software required

| Software            | Version on My PC | Location                                       |
|---------------------|------------------|------------------------------------------------|
| Python              | 3.7.1            | Anywhere, even Anaconda env. will work         |
| Node.js             | 10.15.3          | C:\Program Files\nodejs                       |
| NPM (or JS modules) | 6.11.3           | [What is this?]                                |
| Visual Studio Code  | 1.48.0           | Anywhere, my location is C:\users\<username>\AppData\Local\Programs\Microsoft VS Code\code.exe |

### 1.2 Environment Variables

Python, npm should be added to environment variables path

#### 1.2.1
Right click on python.exe and find the path where the .exe file is placed. Copy the path and add it into the path variable. Ex: Here the path would be - `C:\Program Files\Python3.8\python.exe`

#### 1.2.2
Locate npm folder (generally it is inside `C:\Users\<username>\AppData\Roaming\npm`), and add that as well into the path variable. npm is needed to run JavaScript files in VSCode. [Where is this? Where is the npm path defined?]

After completing above 2 steps, path variable should be like this -


Edit environment variable
- `USERPROFILE%\AppData\Local\Microsoft\WindowsApps`
- `C:\ProgramData\Anaconda3\Scripts\conda.exe`
- `C:\ProgramData\Anaconda3\python.exe`
- `C:\Users\<username>\AppData\Roaming\npm`

### Step 4
Go to extensions tab and search for Python and Azure Functions (both Microsoft) and install them.

(Python extension for Visual Studio Code screenshot)
(Azure Functions for Visual Studio Code screenshot)

### Step 5
Left side, there will be an Azure button.

(Azure button screenshot)

### Step 6
Open a new terminal.

(Terminal screenshot)

### Step 7
Copy python path from anaconda prompt by using `where python` command. In the following command: `--python-path <path>` menu `venv`, it will create a virtual environment.

(Terminal screenshot with command execution)

## Step 8 - Activate Virtual Environment

Activate the virtual environment by running the following command:
```plaintext
.venv\Scripts\activate

Upgrade pip :
python -m pip install --upgrade pip

Install requirements :
pip install -r requirements.txt

Then you can start debugging the code