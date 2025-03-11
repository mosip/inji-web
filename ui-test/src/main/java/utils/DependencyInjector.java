package utils;

import io.cucumber.core.backend.ObjectFactory;
import io.cucumber.picocontainer.PicoFactory;

public class DependencyInjector implements ObjectFactory {
    private final PicoFactory delegate = new PicoFactory();

    public DependencyInjector() {
        // Register all classes that need DI
        delegate.addClass(BaseTest.class);
        delegate.addClass(stepdefinitions.StepDef.class);
        delegate.addClass(stepdefinitions.StepDefMosipCredentials.class);
        delegate.addClass(stepdefinitions.StepDefSunbirdCredentials.class);
    }

    @Override
    public void start() {
        delegate.start();
    }

    @Override
    public void stop() {
        delegate.stop();
    }

    @Override
    public boolean addClass(Class<?> clazz) {
        return delegate.addClass(clazz); // Add classes dynamically if needed
    }

    @Override
    public <T> T getInstance(Class<T> clazz) {
        return delegate.getInstance(clazz);
    }
}
