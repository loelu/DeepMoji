import matplotlib.pyplot as plt

def plot_learning_curves(history):
    # plot accuracy and loss over training and validation data
    plt.plot(history.history["loss"], label="Training Loss")
    plt.plot(history.history["val_loss"], label="Validation Loss")
    plt.legend()
    plt.show()
    
