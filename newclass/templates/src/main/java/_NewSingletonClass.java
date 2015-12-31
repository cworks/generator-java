<%= codeHeader %>
<%= package %>

/**
 * ----------------------------------------------------------------------------
 * Tell me a little something about this <%= className %>
 * @author you
 * ----------------------------------------------------------------------------
 */
public final class <%= className %> {

    /**
    * Single instance created upon class loading.
    */
    private static final <%= className %> INSTANCE =  new <%= className %>();

    /**
    * Private constructor prevents construction outside this class.
    */
    private <%= className %>() {
        // stuff
    }

    public static <%= className %> getInstance() {
        return INSTANCE;
    }
}
