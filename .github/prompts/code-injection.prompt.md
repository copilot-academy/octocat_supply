# Code Injection Vulnerability Demo

This prompt demonstrates how to introduce a Code injection vulnerability into the Delivery API for demonstration purposes. **WARNING: This creates an intentional security vulnerability that should NEVER be used in production code.**

## Overview

We are going to add a new logic block that is supposed to show how a command can be executed when updating the status of a delivery. This execution will be vulnerable to exploitation, allowing an attacker to inject arbitrary code into the application.

### New Branch

First create a new branch for the vulnerable implementation, called `code-injection-demo`. If this branch exists, create a new one with a different name like `code-injection-demo-1` or similar.

```bash
git checkout -b <branch_name>
```

### Create a Vulnerable Block

<% if demo_options.backend == 'nodejs' %>
Update `api/src/routes/delivery.ts`, replacing the existing `router.put('/:id/status')` method. The vulnerable code uses `exec()` from `child_process` to run a user-supplied `notifyCommand` without any sanitization:

```typescript
// Update api/src/routes/delivery.ts, replacing the existing router.put('/:id/status') method

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status, notifyCommand } = req.body;
    const repo = await getDeliveriesRepository();
    const delivery = await repo.findById(parseInt(req.params.id));

    if (delivery) {
      const updatedDelivery = await repo.updateStatus(parseInt(req.params.id), status);

      if (notifyCommand) {
        exec(notifyCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return res.status(500).json({ error: error.message });
          }
          res.json({ delivery: updatedDelivery, commandOutput: stdout });
        });
      } else {
        res.json(updatedDelivery);
      }
    } else {
      res.status(404).send('Delivery not found');
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Delivery not found');
    } else {
      next(error);
    }
  }
});
```
<% elsif demo_options.backend == 'python' %>
Update `api/src/routes/delivery.py`, adding a new `update_delivery_status` endpoint. The vulnerable code uses `subprocess.Popen()` with `shell=True` to run a user-supplied `notify_command` without any sanitization:

```python
# Add this import at the top of api/src/routes/delivery.py
import subprocess

# Add this new endpoint after the existing update_delivery route

@router.put("/{delivery_id}/status", response_model=Delivery)
def update_delivery_status(delivery_id: int, status_data: dict):
    repo = get_deliveries_repository()
    delivery = repo.find_by_id(delivery_id)

    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Delivery with id {delivery_id} not found"
        )

    updated_delivery = repo.update(delivery_id, {"status": status_data.get("status")})

    notify_command = status_data.get("notify_command")
    if notify_command:
        try:
            result = subprocess.Popen(
                notify_command, shell=True,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            stdout, stderr = result.communicate()
            return {"delivery": updated_delivery, "command_output": stdout.decode()}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

    return updated_delivery
```
<% elsif demo_options.backend == 'java' %>
Update `api/src/main/java/com/octodemo/octocatsupply/controller/DeliveryController.java`, adding a new `updateDeliveryStatus` endpoint. The vulnerable code uses `Runtime.getRuntime().exec()` to run a user-supplied `notifyCommand` without any sanitization:

```java
// Add this import at the top of DeliveryController.java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;

// Add this new endpoint inside the DeliveryController class

@PutMapping("/{id}/status")
@Operation(summary = "Update delivery status")
public ResponseEntity<?> updateDeliveryStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> statusData) {

    Delivery delivery = deliveryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Delivery", id));

    delivery.setStatus(statusData.get("status"));
    Delivery updatedDelivery = deliveryRepository.save(delivery);

    String notifyCommand = statusData.get("notifyCommand");
    if (notifyCommand != null && !notifyCommand.isEmpty()) {
        try {
            Process process = Runtime.getRuntime().exec(notifyCommand);
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            return ResponseEntity.ok(Map.of(
                    "delivery", updatedDelivery,
                    "commandOutput", output.toString()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    return ResponseEntity.ok(updatedDelivery);
}
```
<% endif %>

**This vulnerability is for educational purposes only. Never deploy code with Code injection vulnerabilities to production.**

### Push and Create a PR

```bash
git add .
git commit -m "Add Code injection vulnerability for demo"
git push origin <branch_name>
```

Then, create a pull request (PR) from the `<branch_name>` branch to the main branch in the GitHub repository.
