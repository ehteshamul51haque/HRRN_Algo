let numProcesses;
let processes = [];

function getProcessDetails() {
    numProcesses = parseInt(document.getElementById("numProcesses").value);
    let processInputsHTML = "";

    for (let i = 0; i < numProcesses; i++) {
        processInputsHTML += `
            <div>
                <label for="arrivalTime${i}">Arrival Time for Process ${i + 1}: </label>
                <input type="number" id="arrivalTime${i}">
                <label for="burstTime${i}">Burst Time for Process ${i + 1}: </label>
                <input type="number" id="burstTime${i}">
            </div>
        `;
    }

    document.getElementById("processInputs").innerHTML = processInputsHTML;
}

function scheduleProcesses() {
    for (let i = 0; i < numProcesses; i++) {
        let arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
        let burstTime = parseInt(document.getElementById(`burstTime${i}`).value);

        processes.push({
            name: `P${i + 1}`,
            at: arrivalTime,
            bt: burstTime,
            completed: 0,
            ct: 0,
            wt: 0,
            tt: 0,
            ntt: 0,
        });
    }

    sortByArrival(processes, numProcesses);

    let outputHTML = `
        <h2>Process Schedule:</h2>
        <table>
            <tr>
                <th>Process</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Waiting Time</th>
                <th>Turnaround Time</th>
                <th>Normalized Turnaround Time</th>
            </tr>
    `;

    let sum_bt = 0;
    let t = processes[0].at;
    let avgtt = 0;
    let avgwt = 0;

    for (let i = 0; i < numProcesses; i++) {
        sum_bt += processes[i].bt;

        let hrr = -9999;
        let loc;

        for (let j = 0; j < numProcesses; j++) {
            if (processes[j].at <= t && processes[j].completed !== 1) {
                let temp = (processes[j].bt + (t - processes[j].at)) / processes[j].bt;

                if (hrr < temp) {
                    hrr = temp;
                    loc = j;
                }
            }
        }

        t += processes[loc].bt;
        processes[loc].ct = t;
        processes[loc].wt = t - processes[loc].at - processes[loc].bt;
        processes[loc].tt = t - processes[loc].at;
        avgtt += processes[loc].tt;
        processes[loc].ntt = processes[loc].tt / processes[loc].bt;
        processes[loc].completed = 1;
        avgwt += processes[loc].wt;

        outputHTML += `
            <tr>
                <td>${processes[loc].name}</td>
                <td>${processes[loc].at}</td>
                <td>${processes[loc].bt}</td>
                <td>${processes[loc].wt}</td>
                <td>${processes[loc].tt}</td>
                <td>${processes[loc].ntt.toFixed(2)}</td>
            </tr>
        `;
    }

    outputHTML += "</table>";
    outputHTML += `<p>Average Waiting Time: ${(avgwt / numProcesses).toFixed(2)}</p>`;
    outputHTML += `<p>Average Turnaround Time: ${(avgtt / numProcesses).toFixed(2)}</p>`;

    document.getElementById("output").innerHTML = outputHTML;
}

function sortByArrival(p, n) {
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            if (p[i].at > p[j].at) {
                let temp = p[i];
                p[i] = p[j];
                p[j] = temp;
            }
        }
    }
}
